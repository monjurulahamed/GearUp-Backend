import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { updateUserZodSchema } from "./user.validation";

const router = Router();

router.patch(
  "/me",
  checkAuth(),
  validateRequest(updateUserZodSchema),
  UserController.updateMyProfile
);

export const UserRoutes = router;
