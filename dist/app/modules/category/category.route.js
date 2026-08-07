"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const checkAuth_1 = require("../../middlewares/checkAuth");
const category_validation_1 = require("./category.validation");
const router = (0, express_1.Router)();
router.get("/", category_controller_1.CategoryController.getAll);
router.get("/:id", category_controller_1.CategoryController.getById);
router.post("/", (0, checkAuth_1.checkAuth)("ADMIN"), (0, validateRequest_1.validateRequest)(category_validation_1.createCategoryZodSchema), category_controller_1.CategoryController.create);
router.patch("/:id", (0, checkAuth_1.checkAuth)("ADMIN"), (0, validateRequest_1.validateRequest)(category_validation_1.updateCategoryZodSchema), category_controller_1.CategoryController.update);
router.delete("/:id", (0, checkAuth_1.checkAuth)("ADMIN"), category_controller_1.CategoryController.remove);
exports.CategoryRoutes = router;
//# sourceMappingURL=category.route.js.map