import { Response } from "express";
import httpStatus from "http-status-codes";

type SendResponseArgs<T> = {
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: T | null;
  meta?: Record<string, unknown> | null;
};



export const sendResponse = <T>(res: Response, args: SendResponseArgs<T>) => {
  const {
    statusCode = httpStatus.OK,
    success = true,
    message,
    data = null,
    meta = null,
  } = args;

  return res.status(statusCode).json({
    success,
    statusCode,
    message,
    ...(meta ? { meta } : {}),
    data,
  });
};
