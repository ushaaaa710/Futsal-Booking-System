// Rate limiting middleware - Prevents API abuse by limiting request rates

import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/apiResponse";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production)
const store = new Map<string, RateLimitEntry>();

/**
 * Simple in-memory rate limiter.
 * @param maxRequests - Max requests per window
 * @param windowMs - Window duration in milliseconds
 */
export const rateLimiter = (
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    const entry = store.get(key);

    if (!entry || now > entry.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (entry.count >= maxRequests) {
      res.setHeader("Retry-After", Math.ceil((entry.resetTime - now) / 1000));
      sendError(res, 429, "Too many requests. Please try again later.");
      return;
    }

    entry.count++;
    next();
  };
};

// Stricter rate limiter for auth routes
export const authRateLimiter = rateLimiter(20, 15 * 60 * 1000);

export default rateLimiter;
