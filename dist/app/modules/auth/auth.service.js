"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../config/prisma");
const env_1 = require("../../config/env");
const AppError_1 = require("../../errorHelpers/AppError");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jwt_1 = require("../../utils/jwt");
const registerUser = async (payload) => {
    const existing = await prisma_1.prisma.user.findUnique({
        where: { email: payload.email },
    });
    if (existing) {
        throw new AppError_1.AppError(http_status_codes_1.default.CONFLICT, "Email is already registered. Try logging in.");
    }
    const hashedPassword = await bcryptjs_1.default.hash(payload.password, env_1.envVars.BCRYPT_SALT_ROUND);
    const user = await prisma_1.prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            phone: payload.phone,
            address: payload.address,
            role: payload.role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const token = (0, jwt_1.createToken)({
        id: user.id,
        email: user.email,
        role: user.role,
    });
    return { user, token };
};
const loginUser = async (payload) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { email: payload.email },
    });
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.default.UNAUTHORIZED, "Invalid email or password");
    }
    if (user.status === "SUSPENDED") {
        throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, "Your account is suspended. Please contact admin.");
    }
    const isPasswordMatched = await bcryptjs_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.AppError(http_status_codes_1.default.UNAUTHORIZED, "Invalid email or password");
    }
    const token = (0, jwt_1.createToken)({
        id: user.id,
        email: user.email,
        role: user.role,
    });
    const { password: _pw, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
const getMe = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return user;
};
exports.AuthService = {
    registerUser,
    loginUser,
    getMe,
};
//# sourceMappingURL=auth.service.js.map