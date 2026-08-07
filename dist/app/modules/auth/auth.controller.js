"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const auth_service_1 = require("./auth.service");
const register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user, token } = await auth_service_1.AuthService.registerUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "User registered successfully",
        data: { user, token },
    });
});
const login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user, token } = await auth_service_1.AuthService.loginUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "User logged in successfully",
        data: { user, token },
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await auth_service_1.AuthService.getMe(req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Profile retrieved successfully",
        data: user,
    });
});
exports.AuthController = {
    register,
    login,
    getMe,
};
//# sourceMappingURL=auth.controller.js.map