import * as z from "zod";

export const createReviewZodSchema = z.object({
  body: z.object({
    rating: z
      .number({ required_error: "rating is required" })
      .int("Rating must be an integer")
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),
    comment: z.string().max(1000, "Comment too long").optional(),
    gearItemId: z.string({ required_error: "gearItemId is required" }),
  }),
});
