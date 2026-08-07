import Stripe from "stripe";

import { prisma } from "../../config/prisma";

import { envVars } from "../../config/env";
import { AppError } from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20" as any,
});


const createPaymentSession = async (

  customerId: string,
  rentalOrderId: string
): Promise<{ url: string; sessionId: string }> => {

  const order = await prisma.rentalOrder.findUnique({
    where: { id: rentalOrderId },
    include: { items: { include: { gearItem: true } } },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental order not found");
  }
  if (order.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only pay for your own orders");
  }
  if (order.status !== "CONFIRMED") {

    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Order must be CONFIRMED before payment. Current status: ${order.status}`
    );
  }

  
  const existingPending = await prisma.payment.findUnique({
    where: { rentalOrderId: order.id },
  });
  if (existingPending && existingPending.status === "PENDING") {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        existingPending.transactionId
      );
      if (session.url) {
        return { url: session.url, sessionId: session.id };
      }
    } catch {
      
    }
  }

  
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    order.items.map((it) => ({

      price_data: {
        currency: "usd",
        product_data: {
          name: it.gearItem.name,

          description: `${it.quantity} × ${it.gearItem.pricePerDay}/day`,
        },
        unit_amount: Math.round(Number(it.pricePerDay) * it.quantity * 100),
      },
      quantity: 1,
    }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `${envVars.FRONTEND_URL}/payment/success?orderId=${order.id}`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel?orderId=${order.id}`,
    metadata: {
      rentalOrderId: order.id,
      customerId: order.customerId,
    },
  });


  await prisma.payment.upsert({
    where: { rentalOrderId: order.id },
    create: {
      transactionId: session.id,
      rentalOrderId: order.id,
      amount: order.totalAmount,
      method: "STRIPE",
      status: "PENDING",
    },
    update: {
      transactionId: session.id,
      amount: order.totalAmount,
      status: "PENDING",
    },
  });

  return { url: session.url!, sessionId: session.id };
};


const handleStripeWebhook = async (rawBody: Buffer, signature: string) => {

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      envVars.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, `Webhook signature failed: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const rentalOrderId = session.metadata?.rentalOrderId as string;

    if (rentalOrderId) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { transactionId: session.id },
          data: { status: "COMPLETED", paidAt: new Date() },

        }),
        prisma.rentalOrder.update({
          where: { id: rentalOrderId },
          data: { status: "PAID" },
        }),
      ]);
    }
  } else if (event.type === "checkout.session.expired") {

    const session = event.data.object as Stripe.Checkout.Session;
    await prisma.payment.updateMany({
      where: { transactionId: session.id, status: "PENDING" },
      data: { status: "FAILED" },
    });
  }

  return { received: true };
};


const getMyPayments = async (customerId: string) => {
  return prisma.payment.findMany({

    where: { rentalOrder: { customerId } },
    orderBy: { createdAt: "desc" },
    include: {
      rentalOrder: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          totalAmount: true,
          status: true,
          items: {
            select: {
              id: true,
              quantity: true,

              gearItem: { select: { id: true, name: true } },
            },
          },
        },
      
  },
    },
  });
};

const getPaymentById = async (paymentId: string, userId: string, role: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalOrder: {

        select: {
          id: true,
          customerId: true,
          items: {
            include: { gearItem: { select: { providerId: true, name: true } } },
          },
        },
      },
    },
  });
  if (!payment) throw new AppError(httpStatus.NOT_FOUND, "Payment not found");


  if (role === "ADMIN") return payment;
  if (role === "CUSTOMER" && payment.rentalOrder.customerId === userId) {
    return payment;
  }
  
  if (role === "PROVIDER") {
    const isProvider = payment.rentalOrder.items.some(
      (it) => it.gearItem.providerId === userId
    );
    if (isProvider) return payment;
  }
  throw new AppError(httpStatus.FORBIDDEN, "Not authorized to view this payment");
};

export const PaymentService = {
  createPaymentSession,
  handleStripeWebhook,
  getMyPayments,
  getPaymentById,
};
