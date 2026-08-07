"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../../errorHelpers/AppError");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const calculateDays = (start, end) => {
    const ms = end.getTime() - start.getTime();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
    return Math.max(1, days);
};
const createRentalOrder = async (customerId, payload) => {
    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);
    const days = calculateDays(startDate, endDate);
    const gearItems = await prisma_1.prisma.gearItem.findMany({
        where: { id: { in: payload.items.map((i) => i.gearItemId) } },
    });
    if (gearItems.length !== payload.items.length) {
        const foundIds = new Set(gearItems.map((g) => g.id));
        const missing = payload.items
            .filter((i) => !foundIds.has(i.gearItemId))
            .map((i) => i.gearItemId);
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, `Gear item(s) not found: ${missing.join(", ")}`);
    }
    for (const item of payload.items) {
        const gear = gearItems.find((g) => g.id === item.gearItemId);
        if (gear.availability !== "AVAILABLE") {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Gear "${gear.name}" is currently unavailable`);
        }
        if (gear.stock < item.quantity) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Insufficient stock for "${gear.name}". Requested: ${item.quantity}, available: ${gear.stock}`);
        }
        if (gear.providerId === customerId) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `You cannot rent your own gear ("${gear.name}")`);
        }
    }
    const orderItemsData = payload.items.map((item) => {
        const gear = gearItems.find((g) => g.id === item.gearItemId);
        return {
            gearItemId: item.gearItemId,
            quantity: item.quantity,
            pricePerDay: gear.pricePerDay,
        };
    });
    const itemsTotal = orderItemsData.reduce((sum, it) => {
        return sum + Number(it.pricePerDay) * it.quantity;
    }, 0);
    const totalAmount = new client_1.Prisma.Decimal(itemsTotal * days);
    const order = await prisma_1.prisma.rentalOrder.create({
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
const getMyOrders = async (customerId, status) => {
    return prisma_1.prisma.rentalOrder.findMany({
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
const getOrderById = async (orderId, userId, role) => {
    const order = await prisma_1.prisma.rentalOrder.findUnique({
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
    if (!order)
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Order not found");
    if (role === "ADMIN")
        return order;
    if (role === "CUSTOMER" && order.customerId === userId)
        return order;
    if (role === "PROVIDER") {
        const isProviderOfAnyItem = order.items.some((it) => it.gearItem.providerId === userId);
        if (isProviderOfAnyItem)
            return order;
    }
    throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, "You are not authorized to view this order");
};
const getProviderOrders = async (providerId) => {
    return prisma_1.prisma.rentalOrder.findMany({
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
const assertValidTransition = (current, next, isProvider) => {
    const customerAllowed = {
        PLACED: ["CANCELLED"],
        CONFIRMED: ["CANCELLED"],
        PAID: [],
        PICKED_UP: [],
        RETURNED: [],
        CANCELLED: [],
    };
    const providerAllowed = {
        PLACED: ["CONFIRMED"],
        CONFIRMED: ["PICKED_UP"],
        PAID: ["PICKED_UP"],
        PICKED_UP: ["RETURNED"],
        RETURNED: [],
        CANCELLED: [],
    };
    const allowed = isProvider ? providerAllowed[current] : customerAllowed[current];
    if (!allowed.includes(next)) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Invalid status transition: ${current} → ${next}. Allowed: ${allowed.join(", ") || "(none)"}`);
    }
};
const updateOrderStatus = async (orderId, userId, role, nextStatus) => {
    const order = await prisma_1.prisma.rentalOrder.findUnique({
        where: { id: orderId },
        include: { items: { include: { gearItem: true } } },
    });
    if (!order)
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Order not found");
    const isProviderOfOrder = role === "PROVIDER" &&
        order.items.some((it) => it.gearItem.providerId === userId);
    const isCustomerOfOrder = role === "CUSTOMER" && order.customerId === userId;
    const isAdmin = role === "ADMIN";
    if (!isProviderOfOrder && !isCustomerOfOrder && !isAdmin) {
        throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, "You cannot update this order");
    }
    const isProvider = isProviderOfOrder || (isAdmin && nextStatus !== "CANCELLED");
    if (nextStatus === "CANCELLED" && !isCustomerOfOrder && !isAdmin) {
        throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, "Only the customer (or admin) can cancel an order");
    }
    assertValidTransition(order.status, nextStatus, isProvider);
    if (nextStatus === "PICKED_UP") {
        await prisma_1.prisma.$transaction(order.items.map((it) => prisma_1.prisma.gearItem.update({
            where: { id: it.gearItemId },
            data: { stock: { decrement: it.quantity } },
        })));
    }
    if (nextStatus === "CANCELLED") {
    }
    const updated = await prisma_1.prisma.rentalOrder.update({
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
exports.RentalService = {
    createRentalOrder,
    getMyOrders,
    getOrderById,
    getProviderOrders,
    updateOrderStatus,
};
//# sourceMappingURL=rental.service.js.map