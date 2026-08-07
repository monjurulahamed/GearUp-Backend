"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const checkAuth_1 = require("../../middlewares/checkAuth");
const payment_validation_1 = require("./payment.validation");
const router = (0, express_1.Router)();
router.post("/webhook", payment_controller_1.PaymentController.stripeWebhook);
router.post("/create", (0, checkAuth_1.checkAuth)("CUSTOMER"), (0, validateRequest_1.validateRequest)(payment_validation_1.createPaymentZodSchema), payment_controller_1.PaymentController.createPayment);
router.get("/", (0, checkAuth_1.checkAuth)(), payment_controller_1.PaymentController.getMyPayments);
router.get("/:id", (0, checkAuth_1.checkAuth)(), payment_controller_1.PaymentController.getPaymentById);
exports.PaymentRoutes = router;
//# sourceMappingURL=payment.route.js.map