/**
 * Shared error-related TypeScript types.
 */

export interface TErrorSource {
  path: string | number;
  message: string;
}

export interface TErrorDetails {
  code?: string;
  field?: string | string[];
  [key: string]: unknown;
}

export interface TErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorSources?: TErrorSource[];
  errorDetails?: TErrorDetails | unknown;
  err?: unknown;
  stack?: string;
}
