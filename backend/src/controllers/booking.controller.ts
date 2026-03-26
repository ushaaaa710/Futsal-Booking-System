// Booking controller - Handles booking creation, updates, cancellation, and status changes

import { Request, Response } from "express";
import * as bookingService from "../services/booking.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { BookingStatus } from "../types/enums";

/**
 * POST /api/bookings
 * Create a new booking. Requires authenticated user.
 */
export const createBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const { courtId, date, slots } = req.body;

    const booking = await bookingService.createBooking({
      userId,
      courtId,
      date,
      slots,
    });

    sendSuccess(res, 201, "Booking created successfully", booking);
  } catch (err: any) {
    // Slot conflict → 409
    if (err.message.includes("already booked")) {
      sendError(res, 409, err.message);
      return;
    }
    // Other business logic errors → 400
    if (
      err.message.includes("not found") ||
      err.message.includes("unavailable") ||
      err.message.includes("outside operating hours") ||
      err.message.includes("past")
    ) {
      sendError(res, 400, err.message);
      return;
    }
    sendError(res, 500, "Failed to create booking", err.message);
  }
};

/**
 * GET /api/bookings/my
 * Get current user's bookings with pagination and optional status filter.
 */
export const getMyBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const status = req.query.status as BookingStatus | undefined;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await bookingService.getUserBookings(userId, {
      status,
      page,
      limit,
    });

    sendSuccess(res, 200, "Bookings retrieved successfully", result);
  } catch (err: any) {
    sendError(res, 500, "Failed to retrieve bookings", err.message);
  }
};

/**
 * GET /api/bookings/:id
 * Get a single booking by ID.
 */
export const getBookingById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      sendError(res, 404, "Booking not found");
      return;
    }

    // Non-admin users can only see their own bookings
    const userId = req.user?._id?.toString();
    const userRole = req.user?.role;
    if (userRole !== "ADMIN" && booking.userId !== userId) {
      sendError(res, 403, "You are not authorized to view this booking");
      return;
    }

    sendSuccess(res, 200, "Booking retrieved successfully", booking);
  } catch (err: any) {
    sendError(res, 500, "Failed to retrieve booking", err.message);
  }
};

/**
 * GET /api/bookings
 * Get all bookings (admin only). Supports ?status, ?courtId, ?date, ?page, ?limit
 */
export const getAllBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const status = req.query.status as BookingStatus | undefined;
    const courtId = req.query.courtId as string | undefined;
    const date = req.query.date as string | undefined;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await bookingService.getAllBookings({
      status,
      courtId,
      date,
      page,
      limit,
    });

    sendSuccess(res, 200, "Bookings retrieved successfully", result);
  } catch (err: any) {
    sendError(res, 500, "Failed to retrieve bookings", err.message);
  }
};

/**
 * PATCH /api/bookings/:id/status
 * Update booking status (admin only).
 */
export const updateBookingStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(
      req.params.id,
      status,
    );

    if (!booking) {
      sendError(res, 404, "Booking not found");
      return;
    }

    sendSuccess(res, 200, `Booking status updated to ${status}`, booking);
  } catch (err: any) {
    if (err.message.includes("Cannot transition")) {
      sendError(res, 400, err.message);
      return;
    }
    sendError(res, 500, "Failed to update booking status", err.message);
  }
};

/**
 * PATCH /api/bookings/:id/cancel
 * Cancel a booking (user-facing). Only the booking owner can cancel.
 */
export const cancelBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const booking = await bookingService.cancelBooking(req.params.id, userId);

    if (!booking) {
      sendError(res, 404, "Booking not found");
      return;
    }

    sendSuccess(res, 200, "Booking cancelled successfully", booking);
  } catch (err: any) {
    if (err.message.includes("not authorized")) {
      sendError(res, 403, err.message);
      return;
    }
    if (err.message.includes("Cannot transition")) {
      sendError(res, 400, err.message);
      return;
    }
    sendError(res, 500, "Failed to cancel booking", err.message);
  }
};
