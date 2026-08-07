import {z} from "zod/v3";

export const createGearZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Gear name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    description: z
      .string({ required_error: "Description is required" })
      .min(10, "Description must be at least 10 characters"),
    brand: z.string().optional(),
    pricePerDay: z
      .number({ required_error: "pricePerDay is required" })
      .positive("pricePerDay must be greater than 0")
      .max(100000, "pricePerDay is too high"),
    stock: z
      .number()
      .int("Stock must be an integer")
      .min(0, "Stock cannot be negative")
      .default(1),
    availability: z.enum(["AVAILABLE", "UNAVAILABLE"]).default("AVAILABLE"),
    categoryId: z.string({ required_error: "categoryId is required" }),
    images: z.array(z.string().url("Invalid image URL")).optional(),
  }),
});

export const updateGearZodSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      description: z.string().min(10).optional(),
      brand: z.string().optional(),
      pricePerDay: z.number().positive().max(100000).optional(),
      stock: z.number().int().min(0).optional(),
      availability: z.enum(["AVAILABLE", "UNAVAILABLE"]).optional(),
      categoryId: z.string().optional(),
      images: z.array(z.string().url()).optional(),
    })
    .strict(),
});

export const gearFilterZodSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(), // category slug
    categoryId: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    availability: z.enum(["AVAILABLE", "UNAVAILABLE"]).optional(),
    sortBy: z.enum(["priceAsc", "priceDesc", "newest", "oldest"]).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
