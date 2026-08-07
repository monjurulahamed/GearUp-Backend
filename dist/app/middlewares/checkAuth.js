"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const AppError_1 = require("../errorHelpers/AppError");
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../config/prisma");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const checkAuth = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new AppError_1.AppError(http_status_codes_1.default.UNAUTHORIZED, "Authorization token missing. Send header as: Bearer <token>");
            }
            const token = authHeader.split(" ")[1];
            const decoded = (0, jwt_1.verifyToken)(token);
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                },
            });
            if (!user) {
                throw new AppError_1.AppError(http_status_codes_1.default.UNAUTHORIZED, "User no longer exists");
            }
            if (user.status === "SUSPENDED") {
                throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, "Your account is suspended. Please contact admin.");
            }
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, `Access denied — requires role: ${allowedRoles.join(" or ")}`);
            }
            req.user = user;
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=checkAuth.js.map