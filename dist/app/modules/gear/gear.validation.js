"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gearFilterZodSchema = exports.updateGearZodSchema = exports.createGearZodSchema = void 0;
const v3_1 = require("zod/v3");
exports.createGearZodSchema = v3_1.z.object({
    body: v3_1.z.object({
        name: v3_1.z
            .string({ required_error: "Gear name is required" })
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name cannot exceed 100 characters"),
        description: v3_1.z
            .string({ required_error: "Description is required" })
            .min(10, "Description must be at least 10 characters"),
        brand: v3_1.z.string().optional(),
        pricePerDay: v3_1.z
            .number({ required_error: "pricePerDay is required" })
            .positive("pricePerDay must be greater than 0")
            .max(100000, "pricePerDay is too high"),
        stock: v3_1.z
            .number()
            .int("Stock must be an integer")
            .min(0, "Stock cannot be negative")
            .default(1),
        availability: v3_1.z.enum(["AVAILABLE", "UNAVAILABLE"]).default("AVAILABLE"),
        categoryId: v3_1.z.string({ required_error: "categoryId is required" }),
        images: v3_1.z.array(v3_1.z.string().url("Invalid image URL")).optional(),
    }),
});
exports.updateGearZodSchema = v3_1.z.object({
    body: v3_1.z
        .object({
        name: v3_1.z.string().min(2).max(100).optional(),
        description: v3_1.z.string().min(10).optional(),
        brand: v3_1.z.string().optional(),
        pricePerDay: v3_1.z.number().positive().max(100000).optional(),
        stock: v3_1.z.number().int().min(0).optional(),
        availability: v3_1.z.enum(["AVAILABLE", "UNAVAILABLE"]).optional(),
        categoryId: v3_1.z.string().optional(),
        images: v3_1.z.array(v3_1.z.string().url()).optional(),
    })
        .strict(),
});
exports.gearFilterZodSchema = v3_1.z.object({
    query: v3_1.z.object({
        search: v3_1.z.string().optional(),
        category: v3_1.z.string().optional(),
        categoryId: v3_1.z.string().optional(),
        brand: v3_1.z.string().optional(),
        minPrice: v3_1.z.string().optional(),
        maxPrice: v3_1.z.string().optional(),
        availability: v3_1.z.enum(["AVAILABLE", "UNAVAILABLE"]).optional(),
        sortBy: v3_1.z.enum(["priceAsc", "priceDesc", "newest", "oldest"]).optional(),
        page: v3_1.z.string().optional(),
        limit: v3_1.z.string().optional(),
    }),
});
//# sourceMappingURL=gear.validation.js.map