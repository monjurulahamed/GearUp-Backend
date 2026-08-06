import * as z from "zod";

export const registerZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .regex(/\d/, "Password must contain at least 1 number"),

    phone: z.string().optional(),

    address: z.string().optional(),

    role: z.enum(["CUSTOMER", "PROVIDER"]).default("CUSTOMER"),
  }),
});

export const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),

    password: z
      .string()
      .min(1, "Password is required"),
  }),
});

export const updateProfileZodSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .optional(),

      phone: z.string().optional(),

      address: z.string().optional(),
    })
    .strict(),
});