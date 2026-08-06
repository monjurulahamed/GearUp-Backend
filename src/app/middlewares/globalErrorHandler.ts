import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import { AppError } from "../errorHelpers/AppError";
import { handlePrismaError } from "../helpers/handlePrismaError";
import { handleZodError } from "../helpers/handleZodError";

/**
 * Global error handler — last middleware in the chain.
 * Converts every error into a structured JSON response:
 * {
 *   success: false,
 *   statusCode,
 *   message,
 *   errorSources?,   // for validation errors (list of { path, message })
 *   errorDetails?,   // for Prisma errors (extra context)
 *   err?,            // raw error name/string (non-operational)
 *   stack?           // only in development
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err?.message || "Something went wrong";
  let errorSources: { path: string; message: string }[] | undefined;
  let errorDetails: unknown | undefined;

  // 1. Zod validation error
  if (err instanceof ZodError) {
    const zodResult = handleZodError(err);
    statusCode = zodResult.statusCode;
    message = zodResult.message;
    errorSources = zodResult.errorSources;
  }
  // 2. Prisma known error
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaResult = handlePrismaError(err);
    statusCode = prismaResult.statusCode;
    message = prismaResult.message;
    errorDetails = prismaResult.errorDetails;
  }
  // 3. Prisma unknown error (rare — DB connection lost, etc.)
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Unknown database error";
    errorDetails = { message: err.message };
  }
  // 4. Prisma initialization / validation error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Database validation error";
    errorDetails = { message: err.message };
  }
  // 5. Our own AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    if (err.details) errorDetails = err.details;
  }
  // 6. JWT errors
  else if (err?.name === "JsonWebTokenError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Invalid authentication token";
  } else if (err?.name === "TokenExpiredError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Authentication token has expired";
  }
  // 7. Stripe errors (signature verification etc.)
  else if (err?.type?.startsWith("Stripe")) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err.message || "Payment provider error";
    errorDetails = { type: err.type, code: err.code };
  }
  // 8. Unknown
  else if (!err?.isOperational) {
    message = err?.message || "Internal server error";
  }

  // Stack trace only in development
  const stack =
    envVars.NODE_ENV === "development" ? err?.stack : undefined;

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errorSources ? { errorSources } : {}),
    ...(errorDetails ? { errorDetails } : {}),
    ...(stack ? { stack } : {}),
  });
};
