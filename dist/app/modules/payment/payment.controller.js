"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const payment_service_1 = require("./payment.service");
const createPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await payment_service_1.PaymentService.createPaymentSession(req.user.id, req.body.rentalOrderId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Stripe checkout session created. Redirect user to `url`.",
        data: result,
    });
});
const stripeWebhook = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const result = await payment_service_1.PaymentService.handleStripeWebhook(req.body, signature);
    res.status(http_status_codes_1.default.OK).json(result);
});
const getMyPayments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await payment_service_1.PaymentService.getMyPayments(req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Your payment history retrieved successfully",
        data: result,
    });
});
const getPaymentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await payment_service_1.PaymentService.getPaymentById(req.params.id, req.user.id, req.user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Payment details retrieved successfully",
        data: result,
    });
});
exports.PaymentController = {
    createPayment,
    stripeWebhook,
    getMyPayments,
    getPaymentById,
};
//# sourceMappingURL=payment.controller.js.map