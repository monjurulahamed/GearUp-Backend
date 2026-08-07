import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod/v3";
import { AnyZodObject, ZodError } from "zod/v3";

export const validateRequest =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      next(error);
    }
  };