import { Router } from "express";
import { RentalController } from "./rental.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import {
  createRentalZodSchema,
  updateOrderStatusZodSchema,
} from "./rental.validation";

const router = Router();

// ----- Customer -----
router.post(
  "/",
  checkAuth("CUSTOMER"),
  validateRequest(createRentalZodSchema),
  RentalController.createOrder
);
router.get("/me", checkAuth("CUSTOMER"), RentalController.getMyOrders);
router.get("/:id", checkAuth(), RentalController.getOrderById);
router.patch(
  "/:id/cancel",
  checkAuth("CUSTOMER"),
  RentalController.cancelMyOrder
);

// ----- Provider -----
router.get(
  "/provider/incoming",
  checkAuth("PROVIDER"),
  RentalController.getProviderOrders
);
router.patch(
  "/provider/:id/status",
  checkAuth("PROVIDER"),
  validateRequest(updateOrderStatusZodSchema),
  RentalController.updateOrderStatus
);

export const RentalRoutes = router;
