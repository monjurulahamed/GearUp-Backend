import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: { user, token },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await AuthService.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: { user, token },
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await AuthService.getMe(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: user,
  });
});

export const AuthController = {
  register,
  login,
  getMe,
};
