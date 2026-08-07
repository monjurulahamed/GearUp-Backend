"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../config/env");
const AppError_1 = require("../errorHelpers/AppError");
const handlePrismaError_1 = require("../helpers/handlePrismaError");
const handleZodError_1 = require("../helpers/handleZodError");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err?.statusCode || http_status_codes_1.default.INTERNAL_SERVER_ERROR;
    let message = err?.message || "Something went wrong";
    let errorSources;
    let errorDetails;
    if (err instanceof zod_1.ZodError) {
        const zodResult = (0, handleZodError_1.handleZodError)(err);
        statusCode = zodResult.statusCode;
        message = zodResult.message;
        errorSources = zodResult.errorSources;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const prismaResult = (0, handlePrismaError_1.handlePrismaError)(err);
        statusCode = prismaResult.statusCode;
        message = prismaResult.message;
        errorDetails = prismaResult.errorDetails;
    }
    else if (err instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        statusCode = http_status_codes_1.default.BAD_REQUEST;
        message = "Unknown database error";
        errorDetails = { message: err.message };
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = http_status_codes_1.default.BAD_REQUEST;
        message = "Database validation error";
        errorDetails = { message: err.message };
    }
    else if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
        if (err.details)
            errorDetails = err.details;
    }
    else if (err?.name === "JsonWebTokenError") {
        statusCode = http_status_codes_1.default.UNAUTHORIZED;
        message = "Invalid authentication token";
    }
    else if (err?.name === "TokenExpiredError") {
        statusCode = http_status_codes_1.default.UNAUTHORIZED;
        message = "Authentication token has expired";
    }
    else if (err?.type?.startsWith("Stripe")) {
        statusCode = http_status_codes_1.default.BAD_REQUEST;
        message = err.message || "Payment provider error";
        errorDetails = { type: err.type, code: err.code };
    }
    else if (!err?.isOperational) {
        message = err?.message || "Internal server error";
    }
    const stack = env_1.envVars.NODE_ENV === "development" ? err?.stack : undefined;
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(errorSources ? { errorSources } : {}),
        ...(errorDetails ? { errorDetails } : {}),
        ...(stack ? { stack } : {}),
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map