// Role-based access control middleware - Checks user roles (isAdmin, isUser)

import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/apiResponse";

/**
 * Allow only ADMIN users to proceed.
 */
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user && req.user.role === "ADMIN") {
    next();
    return;
  }
  sendError(res, 403, "Admin access required");
};

/**
 * Allow only authenticated USER or ADMIN users to proceed.
 */
export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user) {
    next();
    return;
  }
  sendError(res, 403, "Authentication required");
};
