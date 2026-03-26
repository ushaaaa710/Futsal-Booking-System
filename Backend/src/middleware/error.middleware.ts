// Global error handling middleware - Catches and formats all application errors

import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/apiResponse";

/**
 * Global error handler — must be registered after all routes.
 * Express identifies it as an error handler because it has 4 args.
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Unhandled Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    sendError(res, 400, "Validation error", err.message);
    return;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    sendError(res, 409, `Duplicate value for ${field}`);
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    sendError(res, 400, `Invalid ${err.path}: ${err.value}`);
    return;
  }

  sendError(
    res,
    statusCode,
    message,
    process.env.NODE_ENV === "development" ? err.stack : undefined,
  );
};

export default errorHandler;
