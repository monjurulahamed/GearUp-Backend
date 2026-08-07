"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse = (res, args) => {
    const { statusCode = http_status_codes_1.default.OK, success = true, message, data = null, meta = null, } = args;
    return res.status(statusCode).json({
        success,
        statusCode,
        message,
        ...(meta ? { meta } : {}),
        data,
    });
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map