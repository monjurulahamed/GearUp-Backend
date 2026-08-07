"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const admin_service_1 = require("./admin.service");
const getUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const role = req.query.role;
    const result = await admin_service_1.AdminService.getAllUsers(role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Users retrieved successfully",
        data: result,
        meta: { total: result.length },
    });
});
const updateUserStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.AdminService.updateUserStatus(req.params.id, req.body.status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: `User status updated to ${req.body.status}`,
        data: result,
    });
});
const getGear = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await admin_service_1.AdminService.getAllGear();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "All gear listings retrieved successfully",
        data: result,
        meta: { total: result.length },
    });
});
const getRentals = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const status = req.query.status;
    const result = await admin_service_1.AdminService.getAllRentals(status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "All rental orders retrieved successfully",
        data: result,
        meta: { total: result.length },
    });
});
const getPayments = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await admin_service_1.AdminService.getAllPayments();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "All payments retrieved successfully",
        data: result,
        meta: { total: result.length },
    });
});
const getStats = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await admin_service_1.AdminService.getDashboardStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Dashboard stats retrieved successfully",
        data: result,
    });
});
exports.AdminController = {
    getUsers,
    updateUserStatus,
    getGear,
    getRentals,
    getPayments,
    getStats,
};
//# sourceMappingURL=admin.controller.js.map