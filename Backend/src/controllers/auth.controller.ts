// Authentication controller - Handles login, register, logout, and token refresh requests

import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

/**
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    sendSuccess(res, 201, "Registration successful", { user, token });
  } catch (error: any) {
    if (error.message === "Email already registered") {
      sendError(res, 409, error.message);
      return;
    }
    sendError(res, 500, "Registration failed", error.message);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    sendSuccess(res, 200, "Login successful", { user, token });
  } catch (error: any) {
    if (error.message === "Invalid email or password") {
      sendError(res, 401, error.message);
      return;
    }
    sendError(res, 500, "Login failed", error.message);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Not authenticated");
      return;
    }
    const user = await authService.getUserById(req.user._id.toString());
    sendSuccess(res, 200, "User profile retrieved", { user });
  } catch (error: any) {
    if (error.message === "User not found") {
      sendError(res, 404, error.message);
      return;
    }
    sendError(res, 500, "Failed to get profile", error.message);
  }
};
