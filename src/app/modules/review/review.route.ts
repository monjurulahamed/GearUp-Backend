import { Router } from "express";
import { ReviewController } from "./review.controller";


import { validateRequest } from "../../middlewares/validateRequest";

import { checkAuth } from "../../middlewares/checkAuth";

import { createReviewZodSchema } from "./review.validation";

const router = Router();


router.get("/gear/:gearId", ReviewController.getReviewsByGear);


router.post(
  "/",
  checkAuth("CUSTOMER"),

  validateRequest(createReviewZodSchema),
  
  ReviewController.createReview
);

export const ReviewRoutes = router;
