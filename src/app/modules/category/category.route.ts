import { Router } from "express";
import { CategoryController } from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from "./category.validation";

const router = Router();


router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);

// Admin-only — manage categories
router.post(
  "/",
  checkAuth("ADMIN"),
  validateRequest(createCategoryZodSchema),
  CategoryController.create
);
router.patch(
  "/:id",
  checkAuth("ADMIN"),
  validateRequest(updateCategoryZodSchema),
  CategoryController.update
);
router.delete("/:id", checkAuth("ADMIN"), CategoryController.remove);

export const CategoryRoutes = router;
