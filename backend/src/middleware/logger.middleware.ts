// Logging middleware - Logs incoming requests and outgoing responses

import { Request, Response, NextFunction } from "express";

/**
 * Simple request logger that logs method, path, status code, and response time.
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  // Log when response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color =
      status >= 500 ? "\x1b[31m" : status >= 400 ? "\x1b[33m" : "\x1b[32m";
    const reset = "\x1b[0m";

    console.log(
      `${color}${req.method}${reset} ${req.originalUrl} ${color}${status}${reset} ${duration}ms`,
    );
  });

  next();
};

export default requestLogger;
