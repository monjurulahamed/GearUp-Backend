"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GearService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../../errorHelpers/AppError");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createGear = async (providerId, payload) => {
    const category = await prisma_1.prisma.category.findUnique({
        where: { id: payload.categoryId },
    });
    if (!category) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Category not found");
    }
    return prisma_1.prisma.gearItem.create({
        data: {
            ...payload,
            pricePerDay: new client_1.Prisma.Decimal(payload.pricePerDay),
            providerId,
            images: payload.images ?? [],
        },
        include: {
            category: true,
            provider: { select: { id: true, name: true, email: true } },
        },
    });
};
const updateGear = async (providerId, gearId, payload) => {
    const gear = await prisma_1.prisma.gearItem.findUnique({ where: { id: gearId } });
    if (!gear)
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Gear item not found");
    if (gear.providerId !== providerId) {
        throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, "You can only manage your own gear items");
    }
    const data = { ...payload };
    if (payload.pricePerDay !== undefined) {
        data.pricePerDay = new client_1.Prisma.Decimal(payload.pricePerDay);
    }
    return prisma_1.prisma.gearItem.update({
        where: { id: gearId },
        data,
        include: {
            category: true,
            provider: { select: { id: true, name: true, email: true } },
        },
    });
};
const deleteGear = async (providerId, gearId) => {
    const gear = await prisma_1.prisma.gearItem.findUnique({ where: { id: gearId } });
    if (!gear)
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Gear item not found");
    if (gear.providerId !== providerId) {
        throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, "You can only manage your own gear items");
    }
    return prisma_1.prisma.gearItem.delete({ where: { id: gearId } });
};
const getMyGear = async (providerId) => {
    return prisma_1.prisma.gearItem.findMany({
        where: { providerId },
        orderBy: { createdAt: "desc" },
        include: { category: true, _count: { select: { reviews: true } } },
    });
};
const getAllGear = async (query) => {
    const page = Math.max(1, Number(query.page ?? "1"));
    const limit = Math.min(100, Math.max(1, Number(query.limit ?? "20")));
    const skip = (page - 1) * limit;
    const where = {};
    if (query.search) {
        where.OR = [
            { name: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
        ];
    }
    if (query.category) {
        where.category = { slug: query.category };
    }
    else if (query.categoryId) {
        where.categoryId = query.categoryId;
    }
    if (query.brand) {
        where.brand = { contains: query.brand, mode: "insensitive" };
    }
    if (query.minPrice || query.maxPrice) {
        where.pricePerDay = {};
        if (query.minPrice)
            where.pricePerDay.gte = new client_1.Prisma.Decimal(query.minPrice);
        if (query.maxPrice)
            where.pricePerDay.lte = new client_1.Prisma.Decimal(query.maxPrice);
    }
    if (query.availability) {
        where.availability = query.availability;
    }
    else {
        where.availability = "AVAILABLE";
    }
    let orderBy = { createdAt: "desc" };
    if (query.sortBy === "priceAsc")
        orderBy = { pricePerDay: "asc" };
    else if (query.sortBy === "priceDesc")
        orderBy = { pricePerDay: "desc" };
    else if (query.sortBy === "oldest")
        orderBy = { createdAt: "asc" };
    const [items, total] = await Promise.all([
        prisma_1.prisma.gearItem.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                category: true,
                provider: { select: { id: true, name: true } },
                _count: { select: { reviews: true } },
            },
        }),
        prisma_1.prisma.gearItem.count({ where }),
    ]);
    return {
        items,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};
const getGearById = async (id) => {
    const gear = await prisma_1.prisma.gearItem.findUnique({
        where: { id },
        include: {
            category: true,
            provider: { select: { id: true, name: true, email: true, phone: true } },
            reviews: {
                include: {
                    customer: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: "desc" },
            },
            _count: { select: { reviews: true } },
        },
    });
    if (!gear)
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Gear item not found");
    return gear;
};
exports.GearService = {
    createGear,
    updateGear,
    deleteGear,
    getMyGear,
    getAllGear,
    getGearById,
};
//# sourceMappingURL=gear.service.js.map