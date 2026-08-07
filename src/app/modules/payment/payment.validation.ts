import * as z from "zod";

export const createPaymentZodSchema = z.object({
  body: z.object({
    rentalOrderId: z.string({ required_error: "rentalOrderId is required" }),
    method: z.enum(["STRIPE", "SSLCOMMERZ"]).default("STRIPE"),
  }),
});
