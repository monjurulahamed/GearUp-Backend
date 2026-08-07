"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const prisma_1 = require("../../config/prisma");
const env_1 = require("../../config/env");
const AppError_1 = require("../../errorHelpers/AppError");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const stripe = new stripe_1.default(env_1.envVars.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});
const createPaymentSession = async (customerId, rentalOrderId) => {
    const order = await prisma_1.prisma.rentalOrder.findUnique({
        where: { id: rentalOrderId },
        include: { items: { include: { gearItem: true } } },
    });
    if (!order) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Rental order not found");
    }
    if (order.customerId !== customerId) {
        throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, "You can only pay for your own orders");
    }
    if (order.status !== "CONFIRMED") {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Order must be CONFIRMED before payment. Current status: ${order.status}`);
    }
    const existingPending = await prisma_1.prisma.payment.findUnique({
        where: { rentalOrderId: order.id },
    });
    if (existingPending && existingPending.status === "PENDING") {
        try {
            const session = await stripe.checkout.sessions.retrieve(existingPending.transactionId);
            if (session.url) {
                return { url: session.url, sessionId: session.id };
            }
        }
        catch {
        }
    }
    const lineItems = order.items.map((it) => ({
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
        success_url: `${env_1.envVars.FRONTEND_URL}/payment/success?orderId=${order.id}`,
        cancel_url: `${env_1.envVars.FRONTEND_URL}/payment/cancel?orderId=${order.id}`,
        metadata: {
            rentalOrderId: order.id,
            customerId: order.customerId,
        },
    });
    await prisma_1.prisma.payment.upsert({
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
    return { url: session.url, sessionId: session.id };
};
const handleStripeWebhook = async (rawBody, signature) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, env_1.envVars.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Webhook signature failed: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const rentalOrderId = session.metadata?.rentalOrderId;
        if (rentalOrderId) {
            await prisma_1.prisma.$transaction([
                prisma_1.prisma.payment.update({
                    where: { transactionId: session.id },
                    data: { status: "COMPLETED", paidAt: new Date() },
                }),
                prisma_1.prisma.rentalOrder.update({
                    where: { id: rentalOrderId },
                    data: { status: "PAID" },
                }),
            ]);
        }
    }
    else if (event.type === "checkout.session.expired") {
        const session = event.data.object;
        await prisma_1.prisma.payment.updateMany({
            where: { transactionId: session.id, status: "PENDING" },
            data: { status: "FAILED" },
        });
    }
    return { received: true };
};
const getMyPayments = async (customerId) => {
    return prisma_1.prisma.payment.findMany({
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
const getPaymentById = async (paymentId, userId, role) => {
    const payment = await prisma_1.prisma.payment.findUnique({
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
    if (!payment)
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Payment not found");
    if (role === "ADMIN")
        return payment;
    if (role === "CUSTOMER" && payment.rentalOrder.customerId === userId) {
        return payment;
    }
    if (role === "PROVIDER") {
        const isProvider = payment.rentalOrder.items.some((it) => it.gearItem.providerId === userId);
        if (isProvider)
            return payment;
    }
    throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, "Not authorized to view this payment");
};
exports.PaymentService = {
    createPaymentSession,
    handleStripeWebhook,
    getMyPayments,
    getPaymentById,
};
//# sourceMappingURL=payment.service.js.map