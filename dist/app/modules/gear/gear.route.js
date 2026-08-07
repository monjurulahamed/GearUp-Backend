"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GearRoutes = void 0;
const express_1 = require("express");
const gear_controller_1 = require("./gear.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const checkAuth_1 = require("../../middlewares/checkAuth");
const gear_validation_1 = require("./gear.validation");
const router = (0, express_1.Router)();
router.get("/", (0, validateRequest_1.validateRequest)(gear_validation_1.gearFilterZodSchema), gear_controller_1.GearController.getAllGear);
router.get("/:id", gear_controller_1.GearController.getGearById);
router.post("/provider", (0, checkAuth_1.checkAuth)("PROVIDER"), (0, validateRequest_1.validateRequest)(gear_validation_1.createGearZodSchema), gear_controller_1.GearController.createMyGear);
router.get("/provider/me", (0, checkAuth_1.checkAuth)("PROVIDER"), gear_controller_1.GearController.getMyGear);
router.put("/provider/:id", (0, checkAuth_1.checkAuth)("PROVIDER"), (0, validateRequest_1.validateRequest)(gear_validation_1.updateGearZodSchema), gear_controller_1.GearController.updateMyGear);
router.delete("/provider/:id", (0, checkAuth_1.checkAuth)("PROVIDER"), gear_controller_1.GearController.deleteMyGear);
exports.GearRoutes = router;
//# sourceMappingURL=gear.route.js.map