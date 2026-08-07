import { Prisma } from "@prisma/client";


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
