"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const review_service_1 = require("./review.service");
const createReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await review_service_1.ReviewService.createReview(req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "Review submitted successfully",
        data: result,
    });
});
const getReviewsByGear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await review_service_1.ReviewService.getReviewsByGear(req.params.gearId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Reviews retrieved successfully",
        data: result.reviews,
        meta: {
            averageRating: result.averageRating,
            totalReviews: result.totalReviews,
        },
    });
});
exports.ReviewController = {
    createReview,
    getReviewsByGear,
};
//# sourceMappingURL=review.controller.js.map