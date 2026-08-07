"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRoutes = void 0;
const express_1 = require("express");
const rental_controller_1 = require("./rental.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const checkAuth_1 = require("../../middlewares/checkAuth");
const rental_validation_1 = require("./rental.validation");
const router = (0, express_1.Router)();
router.post("/", (0, checkAuth_1.checkAuth)("CUSTOMER"), (0, validateRequest_1.validateRequest)(rental_validation_1.createRentalZodSchema), rental_controller_1.RentalController.createOrder);
router.get("/me", (0, checkAuth_1.checkAuth)("CUSTOMER"), rental_controller_1.RentalController.getMyOrders);
router.get("/:id", (0, checkAuth_1.checkAuth)(), rental_controller_1.RentalController.getOrderById);
router.patch("/:id/cancel", (0, checkAuth_1.checkAuth)("CUSTOMER"), rental_controller_1.RentalController.cancelMyOrder);
router.get("/provider/incoming", (0, checkAuth_1.checkAuth)("PROVIDER"), rental_controller_1.RentalController.getProviderOrders);
router.patch("/provider/:id/status", (0, checkAuth_1.checkAuth)("PROVIDER"), (0, validateRequest_1.validateRequest)(rental_validation_1.updateOrderStatusZodSchema), rental_controller_1.RentalController.updateOrderStatus);
exports.RentalRoutes = router;
//# sourceMappingURL=rental.route.js.map