"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const checkAuth_1 = require("../../middlewares/checkAuth");
const review_validation_1 = require("./review.validation");
const router = (0, express_1.Router)();
router.get("/gear/:gearId", review_controller_1.ReviewController.getReviewsByGear);
router.post("/", (0, checkAuth_1.checkAuth)("CUSTOMER"), (0, validateRequest_1.validateRequest)(review_validation_1.createReviewZodSchema), review_controller_1.ReviewController.createReview);
exports.ReviewRoutes = router;
//# sourceMappingURL=review.route.js.map