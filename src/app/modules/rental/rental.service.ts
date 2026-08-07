import { Prisma, RentalStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

/**
 * Calculate the number of rental days (inclusive of start and end).
 */
const calculateDays = (start: Date, end: Date): number => {
  const ms = end.getTime() - start.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
};

/**
 * Customer creates a rental order.
 * - Validates every gear item exists, is AVAILABLE, and has enough stock
 * - Computes totalAmount = sum(days * pricePerDay * quantity)
 * - Persists order + order items in a single transaction
 */
const createRentalOrder = async (
  customerId: string,
  payload: {
    startDate: string;
    endDate: string;
    items: { gearItemId: string; quantity: number }[];
    notes?: string;
  }
) => {
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);
  const days = calculateDays(startDate, endDate);

  // Fetch all requested gear items in one query
  const gearItems = await prisma.gearItem.findMany({
    where: { id: { in: payload.items.map((i) => i.gearItemId) } },
  });

  if (gearItems.length !== payload.items.length) {
    const foundIds = new Set(gearItems.map((g) => g.id));
    const missing = payload.items
      .filter((i) => !foundIds.has(i.gearItemId))
      .map((i) => i.gearItemId);
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Gear item(s) not found: ${missing.join(", ")}`
    );
  }

  // Validate availability + stock
  for (const item of payload.items) {
    const gear = gearItems.find((g) => g.id === item.gearItemId)!;
    if (gear.availability !== "AVAILABLE") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Gear "${gear.name}" is currently unavailable`
      );
    }
    if (gear.stock < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient stock for "${gear.name}". Requested: ${item.quantity}, available: ${gear.stock}`
      );
    }
    // Prevent customer from renting their own gear (if they're also a provider)
    if (gear.providerId === customerId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You cannot rent your own gear ("${gear.name}")`
      );
    }
  }

  // Build order items
  const orderItemsData = payload.items.map((item) => {
    const gear = gearItems.find((g) => g.id === item.gearItemId)!;
    return {
      gearItemId: item.gearItemId,
      quantity: item.quantity,
      pricePerDay: gear.pricePerDay,
    };
  });

  // totalAmount = sum(pricePerDay * quantity) * days
  const itemsTotal = orderItemsData.reduce((sum, it) => {
    return sum + Number(it.pricePerDay) * it.quantity;
  }, 0);
  const totalAmount = new Prisma.Decimal(itemsTotal * days);

  // Transaction: create order + items together
  const order = await prisma.rentalOrder.create({
    data: {
      customerId,
      startDate,
      endDate,
      totalAmount,
      status: "PLACED",
      notes: payload.notes,
      items: { create: orderItemsData },
    },
    include: {
      items: { include: { gearItem: true } },
      customer: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  return { order, days };
};

/**
 * Customer: list their own orders.
 */
const getMyOrders = async (customerId: string, status?: RentalStatus) => {
  return prisma.rentalOrder.findMany({
    where: {
      customerId,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          gearItem: { select: { id: true, name: true, brand: true, images: true } },
        },
      },
      payment: true,
    },
  });
};

const getOrderById = async (orderId: string, userId: string, role: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          gearItem: {
            include: {
              provider: { select: { id: true, name: true, email: true, phone: true } },
            },
          },
        },
      },
      customer: { select: { id: true, name: true, email: true, phone: true } },
      payment: true,
    },
  });
  if (!order) throw new AppError(httpStatus.NOT_FOUND, "Order not found");

  // Authorization: customer sees own order; provider sees orders containing their gear; admin sees all
  if (role === "ADMIN") return order;
  if (role === "CUSTOMER" && order.customerId === userId) return order;
  if (role === "PROVIDER") {
    const isProviderOfAnyItem = order.items.some(
      (it) => it.gearItem.providerId === userId
    );
    if (isProviderOfAnyItem) return order;
  }
  throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this order");
};

/**
 * Provider: list orders that include any of their gear.
 */
const getProviderOrders = async (providerId: string) => {
  return prisma.rentalOrder.findMany({
    where: {
      items: { some: { gearItem: { providerId } } },
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          gearItem: { select: { id: true, name: true, brand: true, images: true, providerId: true } },
        },
      },
      customer: { select: { id: true, name: true, email: true, phone: true } },
      payment: true,
    },
  });
};

/**
 * Validate the requested status transition against the current state.
 *
 *   PLACED  ──provider confirms──>  CONFIRMED
 *   PLACED  ──customer cancels──>   CANCELLED
 *   CONFIRMED ──customer cancels──> CANCELLED
 *   CONFIRMED ──payment success──>  PAID   (set by payment webhook)
 *   PAID     ──provider picks up──> PICKED_UP
 *   PICKED_UP ──provider returns──> RETURNED
 */
const assertValidTransition = (
  current: RentalStatus,
  next: RentalStatus,
  isProvider: boolean
) => {
  const customerAllowed: Record<RentalStatus, RentalStatus[]> = {
    PLACED: ["CANCELLED"],
    CONFIRMED: ["CANCELLED"],
    PAID: [],
    PICKED_UP: [],
    RETURNED: [],
    CANCELLED: [],
  };
  const providerAllowed: Record<RentalStatus, RentalStatus[]> = {
    PLACED: ["CONFIRMED"],
    CONFIRMED: ["PICKED_UP"],
    PAID: ["PICKED_UP"],
    PICKED_UP: ["RETURNED"],
    RETURNED: [],
    CANCELLED: [],
  };

  const allowed = isProvider ? providerAllowed[current] : customerAllowed[current];
  if (!allowed.includes(next)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition: ${current} → ${next}. Allowed: ${allowed.join(", ") || "(none)"}`
    );
  }
};

/**
 * Update order status (provider: CONFIRMED / PICKED_UP / RETURNED; customer: CANCELLED).
 */
const updateOrderStatus = async (
  orderId: string,
  userId: string,
  role: string,
  nextStatus: RentalStatus
) => {
  const order = await prisma.rentalOrder.findUnique({
    where: { id: orderId },
    include: { items: { include: { gearItem: true } } },
  });
  if (!order) throw new AppError(httpStatus.NOT_FOUND, "Order not found");

  // Determine whether the requesting user is the provider of this order's gear
  const isProviderOfOrder =
    role === "PROVIDER" &&
    order.items.some((it) => it.gearItem.providerId === userId);

  // Determine whether the requesting user is the customer who owns the order
  const isCustomerOfOrder = role === "CUSTOMER" && order.customerId === userId;

  const isAdmin = role === "ADMIN";

  if (!isProviderOfOrder && !isCustomerOfOrder && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot update this order");
  }

  // Decide who's transitioning
  const isProvider = isProviderOfOrder || (isAdmin && nextStatus !== "CANCELLED");

  // For CANCELLED, only the customer (or admin) may cancel
  if (nextStatus === "CANCELLED" && !isCustomerOfOrder && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only the customer (or admin) can cancel an order"
    );
  }

  assertValidTransition(order.status, nextStatus, isProvider);

  // Decrement stock when PICKED_UP, restore on CANCELLED (before PAID)
  if (nextStatus === "PICKED_UP") {
    await prisma.$transaction(
      order.items.map((it) =>
        prisma.gearItem.update({
          where: { id: it.gearItemId },
          data: { stock: { decrement: it.quantity } },
        })
      )
    );
  }
  if (nextStatus === "CANCELLED") {
    // No stock changes for cancellation before PICKED_UP (we haven't deducted yet)
  }

  const updated = await prisma.rentalOrder.update({
    where: { id: orderId },
    data: { status: nextStatus },
    include: {
      items: { include: { gearItem: true } },
      customer: { select: { id: true, name: true, email: true } },
      payment: true,
    },
  });
  return updated;
};

export const RentalService = {
  createRentalOrder,
  getMyOrders,
  getOrderById,
  getProviderOrders,
  updateOrderStatus,
};
