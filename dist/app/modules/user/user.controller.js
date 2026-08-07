"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const updateMyProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserService.updateMyProfile(req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Profile updated successfully",
        data: result,
    });
});
exports.UserController = {
    updateMyProfile,
};
//# sourceMappingURL=user.controller.js.map