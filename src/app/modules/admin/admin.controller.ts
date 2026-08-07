import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import { Role, RentalStatus, UserStatus } from "@prisma/client";
import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const role = req.query.role as Role | undefined;
  const result = await AdminService.getAllUsers(role);

  sendResponse(res, {
    statusCode: httpStatus.OK,

    message: "Users retrieved successfully",

    data: result,
    meta: { total: result.length },
  });
});



const updateUserStatus = catchAsync(async (req: Request, res: Response) => {

  const result = await AdminService.updateUserStatus(
    
    req.params.id as string,
    req.body.status as UserStatus
  );



  sendResponse(res, {
    statusCode: httpStatus.OK,

    message: `User status updated to ${req.body.status}`,
    data: result,
  });
});




const getGear = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getAllGear();

  sendResponse(res, {

    statusCode: httpStatus.OK,
    message: "All gear listings retrieved successfully",
    data: result,
    meta: { total: result.length },
  });
});




const getRentals = catchAsync(async (req: Request, res: Response) => {

  const status = req.query.status as RentalStatus | undefined;
  const result = await AdminService.getAllRentals(status);
  sendResponse(res, {
    statusCode: httpStatus.OK,

    message: "All rental orders retrieved successfully",
    data: result,
    meta: { total: result.length },
  });
});




const getPayments = catchAsync(async (_req: Request, res: Response) => {

  const result = await AdminService.getAllPayments();
  sendResponse(res, {
    statusCode: httpStatus.OK,

    message: "All payments retrieved successfully",
    data: result,
    meta: { total: result.length },
  });
});




const getStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getDashboardStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
});

export const AdminController = {
  getUsers,
  updateUserStatus,
  getGear,
  getRentals,
  getPayments,
  getStats,
};
