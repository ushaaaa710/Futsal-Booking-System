// Review service - Review aggregation, validation, and rating calculations

import Review, { IReview } from "../models/Review";
import Booking from "../models/Booking";
import { BookingStatus } from "../types/enums";

/**
 * Create a review for a completed booking.
 */
export const createReview = async (data: {
  userId: string;
  courtId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}): Promise<IReview> => {
  // Verify booking exists and is completed
  const booking = await Booking.findById(data.bookingId);
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("Can only review completed bookings");
  }
  if (booking.userId !== data.userId) {
    throw new Error("You can only review your own bookings");
  }

  // Check for existing review
  const existing = await Review.findOne({ bookingId: data.bookingId });
  if (existing) throw new Error("Review already submitted for this booking");

  return Review.create(data);
};

/**
 * Get all reviews for a court.
 */
export const getCourtReviews = async (courtId: string): Promise<IReview[]> => {
  return Review.find({ courtId }).sort({ createdAt: -1 });
};

/**
 * Get the average rating for a court.
 */
export const getCourtAverageRating = async (
  courtId: string,
): Promise<{ average: number; count: number }> => {
  const result = await Review.aggregate([
    { $match: { courtId } },
    {
      $group: {
        _id: null,
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  if (result.length === 0) return { average: 0, count: 0 };
  return {
    average: Math.round(result[0].average * 10) / 10,
    count: result[0].count,
  };
};
