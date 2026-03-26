// Admin controller - Handles admin-specific operations including analytics, user management, and pricing rules

import { Request, Response } from "express";
import * as analyticsService from "../services/analytics.service";
import * as userService from "../services/user.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

/**
 * GET /api/admin/stats
 */
export const getDashboardStats = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const stats = await analyticsService.getDashboardStats();
    sendSuccess(res, 200, "Dashboard stats retrieved", stats);
  } catch (error: any) {
    sendError(res, 500, "Failed to get dashboard stats", error.message);
  }
};

/**
 * GET /api/admin/analytics/bookings
 */
export const getBookingAnalytics = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string, 10) || 7;
    const data = await analyticsService.getBookingsByDay(days);
    sendSuccess(res, 200, "Booking analytics retrieved", data);
  } catch (error: any) {
    sendError(res, 500, "Failed to get booking analytics", error.message);
  }
};

/**
 * GET /api/admin/users
 */
export const getAllUsers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    sendSuccess(res, 200, "Users retrieved", users);
  } catch (error: any) {
    sendError(res, 500, "Failed to get users", error.message);
  }
};
