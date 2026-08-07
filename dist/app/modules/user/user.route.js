"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.patch("/me", (0, checkAuth_1.checkAuth)(), (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), user_controller_1.UserController.updateMyProfile);
exports.UserRoutes = router;
//# sourceMappingURL=user.route.js.map