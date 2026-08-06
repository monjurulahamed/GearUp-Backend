import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema, ZodObject, z } from "zod";

/**
 * Generic request validation middleware backed by Zod.
 *
 * Two supported call styles:
 *
 * Style A — wrapper object (the convention used across all *.validation.ts files in this project):
 *   validateRequest(registerZodSchema)
 *   where `registerZodSchema = z.object({ body: z.object({...}) })`
 *
 * Style B — explicit shape:
 *   validateRequest({ body: bodySchema, query: querySchema, params: paramsSchema })
 */
type ValidationSchemas =
  | ZodSchema
  | {
      body?: ZodSchema;
      query?: ZodSchema;
      params?: ZodSchema;
      cookies?: ZodSchema;
    };

export const validateRequest = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Style A: full Zod schema that wraps { body, query, params, cookies }
      if (schemas instanceof ZodSchema || schemas instanceof ZodObject) {
        const parsed = (schemas as ZodSchema).parse({
          body: req.body,
          query: req.query,
          params: req.params,
          cookies: req.cookies,
        });
        if (parsed && typeof parsed === "object") {
          if (parsed.body !== undefined) req.body = parsed.body;
          if (parsed.query !== undefined)
            req.query = parsed.query as typeof req.query;
          if (parsed.params !== undefined)
            req.params = parsed.params as typeof req.params;
          if (parsed.cookies !== undefined) req.cookies = parsed.cookies;
        }
      } else {
        // Style B: explicit { body, query, params, cookies } schemas
        const s = schemas as {
          body?: ZodSchema;
          query?: ZodSchema;
          params?: ZodSchema;
          cookies?: ZodSchema;
        };
        if (s.body) req.body = s.body.parse(req.body);
        if (s.query) req.query = s.query.parse(req.query) as any;
        if (s.params) req.params = s.params.parse(req.params) as any;
        if (s.cookies) req.cookies = s.cookies.parse(req.cookies);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(err);
      }
      next(err);
    }
  };
};

// re-export z for convenience in validation files
export { z };
