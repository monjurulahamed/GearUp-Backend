"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const AppError_1 = require("../../errorHelpers/AppError");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const category_validation_1 = require("./category.validation");
const prisma_1 = require("../../config/prisma");
const createCategory = async (payload) => {
    const slug = payload.slug?.trim() || (0, category_validation_1.makeSlug)(payload.name);
    const existing = await prisma_1.prisma.category.findFirst({
        where: { OR: [{ name: payload.name }, { slug }] },
    });
    if (existing) {
        throw new AppError_1.AppError(http_status_codes_1.default.CONFLICT, "Category with this name or slug already exists");
    }
    return prisma_1.prisma.category.create({
        data: { name: payload.name, slug, icon: payload.icon },
    });
};
const getAllCategories = async () => {
    const [categories, total] = await Promise.all([
        prisma_1.prisma.category.findMany({
            orderBy: { createdAt: "asc" },
            include: { _count: { select: { gearItems: true } } },
        }),
        prisma_1.prisma.category.count(),
    ]);
    return { categories, total };
};
const getCategoryById = async (id) => {
    return prisma_1.prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { gearItems: true } } },
    });
};
const updateCategory = async (id, payload) => {
    const data = { ...payload };
    if (payload.name && !payload.slug)
        data.slug = (0, category_validation_1.makeSlug)(payload.name);
    return prisma_1.prisma.category.update({ where: { id }, data });
};
const deleteCategory = async (id) => {
    const inUse = await prisma_1.prisma.gearItem.findFirst({
        where: { categoryId: id },
    });
    if (inUse) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Cannot delete category — gear items are linked to it. Reassign or remove them first.");
    }
    return prisma_1.prisma.category.delete({ where: { id } });
};
exports.CategoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
//# sourceMappingURL=category.service.js.map