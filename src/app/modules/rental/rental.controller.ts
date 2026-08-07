import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import { RentalStatus } from "@prisma/client";

import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";
import { RentalService } from "./rental.service";




const createOrder = catchAsync(async (req: Request, res: Response) => {

  const { order, days } = await RentalService.createRentalOrder(
    req.user!.id,
    req.body
  );
  sendResponse(res, {

    statusCode: httpStatus.CREATED,

    message: `Rental order placed successfully for ${days} day(s)`,
    data: order,
    }
);
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const status = req.query.status as RentalStatus | undefined;
  const result = await RentalService.getMyOrders(req.user!.id, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Your rental orders retrieved successfully",
    data: result,
    }
  );
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.getOrderById(
    req.params.id as string,
    req.user!.id,
    req.user!.role
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

const cancelMyOrder = catchAsync(async (req: Request, res: Response) => {


  const result = await RentalService.updateOrderStatus(
    req.params.id as string,

    req.user!.id,

    req.user!.role,
    "CANCELLED"
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,

    message: "Order cancelled successfully",

    data: result,
  });
});


const getProviderOrders = catchAsync(async (req: Request, res: Response) => {

  const result = await RentalService.getProviderOrders(req.user!.id);

  sendResponse(res, {

    statusCode: httpStatus.OK,

    message: "Incoming rental orders retrieved successfully",
    data: result,
  })
  ;
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {

  const result = await RentalService.updateOrderStatus(

    req.params.id as string,
    req.user!.id,
    req.user!.role,
    req.body.status
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Order status updated to ${req.body.status}`,
    data: result,
  });
});

export const RentalController = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelMyOrder,
  getProviderOrders,
  updateOrderStatus,
};
