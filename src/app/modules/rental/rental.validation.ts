import * as z from "zod";

export const createRentalZodSchema = z.object({
  body: z
    .object({
      startDate: z.string({ required_error: "startDate is required" }).refine(
        (val) => !isNaN(Date.parse(val)),
        "Invalid startDate — must be ISO string"
      ),
      endDate: z.string({ required_error: "endDate is required" }).refine(
        (val) => !isNaN(Date.parse(val)),
        "Invalid endDate — must be ISO string"
      ),
      items: z
        .array(
          z.object({
            gearItemId: z.string({ required_error: "gearItemId is required" }),
            quantity: z
              .number()
              .int("Quantity must be an integer")
              .min(1, "Quantity must be at least 1")
              .default(1),
          })
        )
        .min(1, "At least one gear item is required"),
      notes: z.string().max(500).optional(),
    })
    .refine(
      (data) => new Date(data.endDate) >= new Date(data.startDate),
      "endDate must be on or after startDate"
    )
    .refine(
      (data) => new Date(data.startDate) >= new Date(new Date().toDateString()),
      "startDate cannot be in the past"
    ),
});

export const updateOrderStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(["CONFIRMED", "PICKED_UP", "RETURNED", "CANCELLED"], {
      required_error: "status is required",
    }),
  }),
});
