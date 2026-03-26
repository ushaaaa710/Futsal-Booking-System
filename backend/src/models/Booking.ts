// Booking database model with status, time slots, pricing, and user/court references

import mongoose, { Schema } from "mongoose";
import { IBooking } from "../types/interfaces";
import { BookingStatus } from "../types/enums";

const bookingSchema = new Schema<IBooking>(
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
    date: {
      type: String,
      required: true, // "YYYY-MM-DD"
    },
    slots: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one time slot is required",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient availability lookups
bookingSchema.index({ courtId: 1, date: 1, status: 1 });
// Index for user booking history
bookingSchema.index({ userId: 1, date: -1 });

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
