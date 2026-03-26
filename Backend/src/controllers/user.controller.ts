// User controller - Handles user profile CRUD operations and wallet management

import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

/**
 * GET /api/users — List all users (basic info for chat contacts etc.)
 */
export const getAllUsers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    sendSuccess(res, 200, "Users retrieved successfully", users);
  } catch (error: any) {
    sendError(res, 500, "Failed to retrieve users", error.message);
  }
};

/**
 * GET /api/users/:id
 */
export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }
    sendSuccess(res, 200, "User retrieved successfully", user);
  } catch (error: any) {
    sendError(res, 500, "Failed to retrieve user", error.message);
  }
};

/**
 * PUT /api/users/:id
 */
export const updateProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user || req.user._id.toString() !== req.params.id) {
      sendError(res, 403, "You can only update your own profile");
      return;
    }
    const user = await userService.updateUserProfile(req.params.id, req.body);
    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }
    sendSuccess(res, 200, "Profile updated successfully", user);
  } catch (error: any) {
    sendError(res, 500, "Failed to update profile", error.message);
  }
};

/**
 * POST /api/users/:id/wallet/topup
 */
export const topUpWallet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      sendError(res, 400, "Amount must be a positive number");
      return;
    }
    const user = await userService.addToWallet(req.params.id, amount);
    sendSuccess(res, 200, "Wallet topped up successfully", user);
  } catch (error: any) {
    sendError(res, 500, "Failed to top up wallet", error.message);
  }
};
