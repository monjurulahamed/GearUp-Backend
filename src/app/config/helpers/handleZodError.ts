import { ZodError } from "zod";

/**
 * Maps a Zod validation error to { statusCode, message, errorSources }.
 */
export const handleZodError = (
  err: ZodError
): {
  statusCode: number;
  message: string;
  errorSources: { path: string; message: string }[];
} => {
  const errorSources = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation error",
    errorSources,
  };
};
