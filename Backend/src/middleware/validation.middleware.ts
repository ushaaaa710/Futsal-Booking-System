// Request validation middleware - Validates request body and parameters using Zod

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sendError } from "../utils/apiResponse";

/**
 * Generic validation middleware factory.
 * Pass a Zod schema and the request property to validate ('body' | 'params' | 'query').
 */
export const validate = (
  schema: z.ZodType,
  source: "body" | "params" | "query" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (result.success) {
      req[source] = result.data;
      next();
    } else {
      const formatted = result.error.issues.map((issue: any) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      sendError(res, 400, "Validation failed", formatted);
    }
  };
};
