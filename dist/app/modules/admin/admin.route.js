"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("../user/user.validation");
const router = (0, express_1.Router)();
router.use((0, checkAuth_1.checkAuth)("ADMIN"));
router.get("/users", admin_controller_1.AdminController.getUsers);
router.patch("/users/:id", (0, validateRequest_1.validateRequest)(user_validation_1.userStatusZodSchema), admin_controller_1.AdminController.updateUserStatus);
router.get("/gear", admin_controller_1.AdminController.getGear);
router.get("/rentals", admin_controller_1.AdminController.getRentals);
router.get("/payments", admin_controller_1.AdminController.getPayments);
router.get("/stats", admin_controller_1.AdminController.getStats);
exports.AdminRoutes = router;
//# sourceMappingURL=admin.route.js.map