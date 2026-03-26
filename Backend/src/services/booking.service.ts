// Booking service - Booking validation, slot conflict detection, and pricing calculations

import mongoose from "mongoose";
import Booking from "../models/Booking";
import { IBooking } from "../types/interfaces";
import { BookingStatus } from "../types/enums";
import * as bookingLogic from "./bookingLogic.service";

interface PaginatedResult {
  bookings: IBooking[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Create a new booking after running all validation checks.
 * Uses a MongoDB transaction to prevent double-booking under concurrent requests.
 */
export const createBooking = async (data: {
  userId: string;
  courtId: string;
  date: string;
  slots: string[];
}): Promise<IBooking> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Run full validation pipeline (court exists, hours, conflicts, price)
    const validation = await bookingLogic.validateBookingRequest(
      data.courtId,
      data.date,
      data.slots,
    );

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const booking = new Booking({
      userId: data.userId,
      courtId: data.courtId,
      date: data.date,
      slots: data.slots,
      totalPrice: validation.totalPrice,
      status: BookingStatus.PENDING,
    });

    await booking.save({ session });

    // Re-check availability within the transaction to prevent race conditions
    const conflictCount = await Booking.countDocuments({
      courtId: data.courtId,
      date: data.date,
      status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      slots: { $in: data.slots },
      _id: { $ne: booking._id },
    }).session(session);

    if (conflictCount > 0) {
      await session.abortTransaction();
      throw new Error(
        `The following slots are already booked: ${data.slots.join(", ")}`,
      );
    }

    await session.commitTransaction();
    return booking;
  } catch (error) {
    // Only abort if the transaction hasn't been committed/aborted already
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Get a single booking by ID.
 */
export const getBookingById = async (id: string): Promise<IBooking | null> => {
  return Booking.findById(id);
};

/**
 * Get all bookings for a specific user with pagination and optional status filter.
 */
export const getUserBookings = async (
  userId: string,
  options: { status?: BookingStatus; page?: number; limit?: number },
): Promise<PaginatedResult> => {
  const { status, page = 1, limit = 10 } = options;

  const query: Record<string, any> = { userId };
  if (status) query.status = status;

  const total = await Booking.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  const bookings = await Booking.find(query)
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { bookings, total, page, totalPages };
};

/**
 * Get all bookings (admin). Supports pagination and filtering by status/date/court.
 */
export const getAllBookings = async (options: {
  status?: BookingStatus;
  courtId?: string;
  date?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult> => {
  const { status, courtId, date, page = 1, limit = 10 } = options;

  const query: Record<string, any> = {};
  if (status) query.status = status;
  if (courtId) query.courtId = courtId;
  if (date) query.date = date;

  const total = await Booking.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  const bookings = await Booking.find(query)
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { bookings, total, page, totalPages };
};

/**
 * Update booking status. Enforces valid status transitions:
 *   PENDING  -> CONFIRMED | CANCELLED
 *   CONFIRMED -> COMPLETED | CANCELLED
 *   CANCELLED -> (no transitions)
 *   COMPLETED -> (no transitions)
 */
export const updateBookingStatus = async (
  id: string,
  newStatus: BookingStatus,
  userId?: string,
): Promise<IBooking | null> => {
  const booking = await Booking.findById(id);
  if (!booking) return null;

  // If a userId is provided, verify ownership (non-admin use case)
  if (userId && booking.userId !== userId) {
    throw new Error("You are not authorized to modify this booking");
  }

  // Validate status transitions
  const validTransitions: Record<string, BookingStatus[]> = {
    [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    [BookingStatus.CONFIRMED]: [
      BookingStatus.COMPLETED,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.CANCELLED]: [],
    [BookingStatus.COMPLETED]: [],
  };

  const allowed = validTransitions[booking.status] || [];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Cannot transition from ${booking.status} to ${newStatus}`);
  }

  booking.status = newStatus;
  return booking.save();
};

/**
 * Cancel a booking (user-facing). Only PENDING or CONFIRMED bookings can be cancelled.
 */
export const cancelBooking = async (
  id: string,
  userId: string,
): Promise<IBooking | null> => {
  return updateBookingStatus(id, BookingStatus.CANCELLED, userId);
};
