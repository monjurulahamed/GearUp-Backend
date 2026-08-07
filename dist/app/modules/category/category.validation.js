"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSlug = exports.updateCategoryZodSchema = exports.createCategoryZodSchema = void 0;
const v3_1 = require("zod/v3");
const slugify = (s) => s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
exports.createCategoryZodSchema = v3_1.z.object({
    body: v3_1.z.object({
        name: v3_1.z
            .string({ required_error: "Category name is required" })
            .min(2, "Name must be at least 2 characters")
            .max(40, "Name cannot exceed 40 characters"),
        slug: v3_1.z.string().optional(),
        icon: v3_1.z.string().optional(),
    }),
});
exports.updateCategoryZodSchema = v3_1.z.object({
    body: v3_1.z
        .object({
        name: v3_1.z.string().min(2).max(40).optional(),
        slug: v3_1.z.string().optional(),
        icon: v3_1.z.string().optional(),
    })
        .strict(),
});
exports.makeSlug = slugify;
//# sourceMappingURL=category.validation.js.map