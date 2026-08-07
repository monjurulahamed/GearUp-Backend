"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const checkAuth_1 = require("../../middlewares/checkAuth");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.validateRequest)(auth_validation_1.registerZodSchema), auth_controller_1.AuthController.register);
router.post("/login", (0, validateRequest_1.validateRequest)(auth_validation_1.loginZodSchema), auth_controller_1.AuthController.login);
router.get("/me", (0, checkAuth_1.checkAuth)(), auth_controller_1.AuthController.getMe);
exports.AuthRoutes = router;
//# sourceMappingURL=auth.route.js.map