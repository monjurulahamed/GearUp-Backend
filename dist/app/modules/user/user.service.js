"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../../errorHelpers/AppError");
const updateMyProfile = async (userId, payload) => {
    const updated = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            role: true,
            status: true,
            updatedAt: true,
        },
    });
    return updated;
};
const updateUserStatus = async (userId, status) => {
    const existing = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (existing.role === "ADMIN") {
        throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, "Admin user status cannot be changed");
    }
    const updated = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { status },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            updatedAt: true,
        },
    });
    return updated;
};
exports.UserService = {
    updateMyProfile,
    updateUserStatus,
};
//# sourceMappingURL=user.service.js.map