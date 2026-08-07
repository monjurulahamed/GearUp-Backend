import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";


const createPayment = catchAsync(async (req: Request, res: Response) => {

  const result = await PaymentService.createPaymentSession(

    req.user!.id,
    req.body.rentalOrderId
  );
  sendResponse(res, {

    statusCode: httpStatus.OK,

    message: "Stripe checkout session created. Redirect user to `url`.",
    data: result,
  });
});


const stripeWebhook = catchAsync(async (req: Request, res: Response) => {

  const signature = req.headers["stripe-signature"] as string;
  const result = await PaymentService.handleStripeWebhook(req.body, signature);
  res.status(httpStatus.OK).json(result);
}
);

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getMyPayments(req.user!.id);
  sendResponse(res, {

    statusCode: httpStatus.OK,
    message: "Your payment history retrieved successfully",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {

  const result = await PaymentService.getPaymentById(
    req.params.id as string,
    req.user!.id,
    req.user!.role
  );
  sendResponse(res, {

    statusCode: httpStatus.OK,
    
    message: "Payment details retrieved successfully",
    data: result,
  });
});

export const PaymentController = {
  createPayment,
  stripeWebhook,
  getMyPayments,
  getPaymentById,
};
