import * as z from "zod";

export const updateUserZodSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(50).optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
    })
    .strict(),
});

export const userStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "SUSPENDED"]),
  }),
});
