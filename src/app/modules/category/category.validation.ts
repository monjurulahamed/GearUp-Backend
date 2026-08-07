import {z} from "zod/v3";
import { Request, Response, NextFunction } from "express";


const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");


export const createCategoryZodSchema = z.object({
  body: z.object({

    name: z
      .string({ required_error: "Category name is required" })
      .min(2, "Name must be at least 2 characters")

      .max(40, "Name cannot exceed 40 characters"),
    slug: z.string().optional(),
    icon: z.string().optional(),
  }),
});

export const updateCategoryZodSchema = z.object({
  body: z
    .object({

      name: z.string().min(2).max(40).optional(),
      slug: z.string().optional(),

      icon: z.string().optional(),
    })
    .strict(),
});


export const makeSlug = slugify;
