"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../../errorHelpers/AppError");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createReview = async (customerId, payload) => {
    const gear = await prisma_1.prisma.gearItem.findUnique({
        where: { id: payload.gearItemId },
    });
    if (!gear) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Gear item not found");
    }
    const returnedOrder = await prisma_1.prisma.rentalOrder.findFirst({
        where: {
            customerId,
            status: "RETURNED",
            items: { some: { gearItemId: payload.gearItemId } },
        },
    });
    if (!returnedOrder) {
        throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, "You can only review gear after completing (returning) a rental for it");
    }
    return prisma_1.prisma.review.create({
        data: {
            rating: payload.rating,
            comment: payload.comment,
            customerId,
            gearItemId: payload.gearItemId,
        },
        include: {
            customer: { select: { id: true, name: true } },
            gearItem: { select: { id: true, name: true } },
        },
    });
};
const getReviewsByGear = async (gearItemId) => {
    const gear = await prisma_1.prisma.gearItem.findUnique({
        where: { id: gearItemId },
        select: { id: true },
    });
    if (!gear) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Gear item not found");
    }
    const [reviews, aggregate] = await Promise.all([
        prisma_1.prisma.review.findMany({
            where: { gearItemId },
            orderBy: { createdAt: "desc" },
            include: { customer: { select: { id: true, name: true } } },
        }),
        prisma_1.prisma.review.aggregate({
            where: { gearItemId },
            _avg: { rating: true },
            _count: { rating: true },
        }),
    ]);
    return {
        reviews,
        averageRating: aggregate._avg.rating,
        totalReviews: aggregate._count.rating,
    };
};
exports.ReviewService = {
    createReview,
    getReviewsByGear,
};
//# sourceMappingURL=review.service.js.map