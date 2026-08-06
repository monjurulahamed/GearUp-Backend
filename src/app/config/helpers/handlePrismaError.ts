import { Prisma } from "@prisma/client";

/**
 * Maps Prisma known-request errors to { statusCode, message }.
 * Equivalent to Mongoose's handleCastError / handleDuplicateError.
 *
 * Common Prisma error codes:
 *  - P2002: Unique constraint failed
 *  - P2025: Record not found (findUniqueOrThrow / update / delete on missing id)
 *  - P2003: Foreign key constraint failed
 *  - P2014: Invalid required relation
 *  - P2001: Record does not exist
 */
export const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError
): { statusCode: number; message: string; errorDetails?: unknown } => {
  switch (err.code) {
    case "P2002": {
      const target = (err.meta?.target as string[])?.join(", ") ?? "field";
      return {
        statusCode: 409,
        message: `Duplicate value — a record with this ${target} already exists.`,
        errorDetails: { field: err.meta?.target },
      };
    }
    case "P2025": {
      const cause = (err.meta?.cause as string) ?? "Requested resource not found";
      return {
        statusCode: 404,
        message: cause,
        errorDetails: err.meta,
      };
    }
    case "P2003": {
      const field =
        (err.meta?.field_name as string) ?? "related record";
      return {
        statusCode: 400,
        message: `Invalid reference — ${field} does not exist.`,
        errorDetails: err.meta,
      };
    }
    case "P2014": {
      return {
        statusCode: 400,
        message: "Invalid required relation provided.",
        errorDetails: err.meta,
      };
    }
    case "P2001": {
      return {
        statusCode: 404,
        message: "Record does not exist.",
        errorDetails: err.meta,
      };
    }
    default: {
      return {
        statusCode: 400,
        message: "Database request error.",
        errorDetails: { code: err.code, meta: err.meta },
      };
    }
  }
};
