"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GearController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const gear_service_1 = require("./gear.service");
const getAllGear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await gear_service_1.GearService.getAllGear(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Gear list retrieved successfully",
        data: result.items,
        meta: result.meta,
    });
});
const getGearById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await gear_service_1.GearService.getGearById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Gear details retrieved successfully",
        data: result,
    });
});
const createMyGear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await gear_service_1.GearService.createGear(req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "Gear item added to your inventory",
        data: result,
    });
});
const updateMyGear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await gear_service_1.GearService.updateGear(req.user.id, req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Gear item updated successfully",
        data: result,
    });
});
const deleteMyGear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await gear_service_1.GearService.deleteGear(req.user.id, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Gear item removed from inventory",
        data: result,
    });
});
const getMyGear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await gear_service_1.GearService.getMyGear(req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Your gear inventory retrieved successfully",
        data: result,
    });
});
exports.GearController = {
    getAllGear,
    getGearById,
    createMyGear,
    updateMyGear,
    deleteMyGear,
    getMyGear,
};
//# sourceMappingURL=gear.controller.js.map