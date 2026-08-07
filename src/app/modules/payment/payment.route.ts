import { Router } from "express";

import { PaymentController } from "./payment.controller";

import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";

import { createPaymentZodSchema } from "./payment.validation";

const router = Router();


router.post("/webhook", PaymentController.stripeWebhook);

// Authenticated routes
router.post(
  "/create",
  checkAuth("CUSTOMER"),
  validateRequest(createPaymentZodSchema),
  PaymentController.createPayment
);
router.get("/", checkAuth(), PaymentController.getMyPayments);
router.get("/:id", checkAuth(), PaymentController.getPaymentById);

export const PaymentRoutes = router;
