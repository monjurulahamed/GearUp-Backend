import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import {
  loginZodSchema,
  registerZodSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerZodSchema),
  AuthController.register
);

router.post(
  "/login",
  validateRequest(loginZodSchema),
  AuthController.login
);

router.get("/me", checkAuth(), AuthController.getMe);

export const AuthRoutes = router;
