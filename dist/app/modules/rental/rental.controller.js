"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const rental_service_1 = require("./rental.service");
const createOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { order, days } = await rental_service_1.RentalService.createRentalOrder(req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: `Rental order placed successfully for ${days} day(s)`,
        data: order,
    });
});
const getMyOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const status = req.query.status;
    const result = await rental_service_1.RentalService.getMyOrders(req.user.id, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Your rental orders retrieved successfully",
        data: result,
    });
});
const getOrderById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await rental_service_1.RentalService.getOrderById(req.params.id, req.user.id, req.user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Order retrieved successfully",
        data: result,
    });
});
const cancelMyOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await rental_service_1.RentalService.updateOrderStatus(req.params.id, req.user.id, req.user.role, "CANCELLED");
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Order cancelled successfully",
        data: result,
    });
});
const getProviderOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await rental_service_1.RentalService.getProviderOrders(req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Incoming rental orders retrieved successfully",
        data: result,
    });
});
const updateOrderStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await rental_service_1.RentalService.updateOrderStatus(req.params.id, req.user.id, req.user.role, req.body.status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: `Order status updated to ${req.body.status}`,
        data: result,
    });
});
exports.RentalController = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelMyOrder,
    getProviderOrders,
    updateOrderStatus,
};
//# sourceMappingURL=rental.controller.js.map