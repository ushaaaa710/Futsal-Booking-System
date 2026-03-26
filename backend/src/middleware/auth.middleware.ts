// Authentication middleware - JWT verification and token extraction from requests

import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/enums";
import { verifyToken } from "../services/auth.service";
import { sendError } from "../utils/apiResponse";

/**
 * Verify JWT token from Authorization header and attach user to req.user.
 * Falls back to mock user in development when no token is provided.
 *
 * Usage:
 *   Authorization: Bearer <jwt_token>
 *
 * For development/testing without real tokens, send:
 *   X-Mock-Role: ADMIN | USER
 *   (only works when NODE_ENV !== "production")
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  // ── Real JWT verification ──
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (!token) {
      sendError(res, 401, "Access denied. Malformed token.");
      return;
    }

    try {
      const decoded = verifyToken(token);
      (req as any).user = decoded;
      next();
      return;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        sendError(res, 401, "Token has expired. Please login again.");
        return;
      }
      sendError(res, 401, "Invalid token.");
      return;
    }
  }

  // ── Development mock mode ──
  // Only activates if X-Mock-Role header is explicitly set AND not in production
  if (process.env.NODE_ENV !== "production") {
    const mockRole = req.headers["x-mock-role"] as string | undefined;
    if (mockRole) {
      (req as any).user = {
        _id: mockRole === "ADMIN" ? "000000000000000000000001" : "000000000000000000000002",
        name: mockRole === "ADMIN" ? "Admin User" : "Mock User",
        email:
          mockRole === "ADMIN" ? "admin@courtsync.np" : "user@courtsync.np",
        role: mockRole === "ADMIN" ? UserRole.ADMIN : UserRole.USER,
      };
      next();
      return;
    }
  }

  // Production: no token = denied
  sendError(res, 401, "Access denied. No token provided.");
};

