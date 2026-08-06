import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

/**
 * 404 handler — fires when no route matched the incoming request.
 */
export const notFound = (req: Request, res: Response, _next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: 404,
    message: `Route not found — ${req.method} ${req.originalUrl}`,
  });
};
