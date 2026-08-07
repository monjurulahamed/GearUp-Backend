import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GearService } from "./gear.service";

// ----- Public -----
const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.getAllGear(req.query as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Gear list retrieved successfully",
    data: result.items,
    meta: result.meta,
  });
});

const getGearById = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.getGearById(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Gear details retrieved successfully",
    data: result,
  });
});

// ----- Provider -----
const createMyGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.createGear(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Gear item added to your inventory",
    data: result,
  });
});

const updateMyGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.updateGear(
    req.user!.id,
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Gear item updated successfully",
    data: result,
  });
});

const deleteMyGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.deleteGear(req.user!.id, req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Gear item removed from inventory",
    data: result,
  });
});

const getMyGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.getMyGear(req.user!.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Your gear inventory retrieved successfully",
    data: result,
  });
});

export const GearController = {
  getAllGear,
  getGearById,
  createMyGear,
  updateMyGear,
  deleteMyGear,
  getMyGear,
};
