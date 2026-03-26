// Review and rating database model for completed bookings

import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  userId: string;
  courtId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    courtId: {
      type: String,
      required: true,
      ref: "Court",
    },
    bookingId: {
      type: String,
      required: true,
      ref: "Booking",
      unique: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ courtId: 1, rating: -1 });
reviewSchema.index({ userId: 1 });

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
