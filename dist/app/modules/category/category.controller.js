"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const category_service_1 = require("./category.service");
const create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await category_service_1.CategoryService.createCategory(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "Category created successfully",
        data: result,
    });
});
const getAll = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await category_service_1.CategoryService.getAllCategories();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Categories retrieved successfully",
        data: result.categories,
        meta: { total: result.total },
    });
});
const getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await category_service_1.CategoryService.getCategoryById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Category retrieved successfully",
        data: result,
    });
});
const update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await category_service_1.CategoryService.updateCategory(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Category updated successfully",
        data: result,
    });
});
const remove = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await category_service_1.CategoryService.deleteCategory(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Category deleted successfully",
        data: result,
    });
});
exports.CategoryController = {
    create,
    getAll,
    getById,
    update,
    remove,
};
//# sourceMappingURL=category.controller.js.map