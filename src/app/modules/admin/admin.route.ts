import { Router } from "express";

import { AdminController } from "./admin.controller";

import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { userStatusZodSchema } from "../user/user.validation";

const router = Router();


router.use(checkAuth("ADMIN"));

router.get("/users", AdminController.getUsers);
router.patch(

  "/users/:id",
  validateRequest(userStatusZodSchema),

  AdminController.updateUserStatus
);
router.get("/gear", AdminController.getGear);

router.get("/rentals", AdminController.getRentals);
router.get("/payments", AdminController.getPayments);

router.get("/stats", AdminController.getStats);

export const AdminRoutes = router;
