
import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Review submitted successfully",
    data: result,
  }
);
});

const getReviewsByGear = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getReviewsByGear(req.params.gearId as string);

  sendResponse(res, {

    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result.reviews,
    meta: {
      
      averageRating: result.averageRating,
      totalReviews: result.totalReviews,
    },
  });
});

export const ReviewController = {
  createReview,
  getReviewsByGear,
};
