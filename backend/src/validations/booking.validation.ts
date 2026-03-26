// Booking validation schemas - Zod schemas for booking create, update, and status operations

import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeSlotRegex = /^([01]\d|2[0-3]):00$/;

export const createBookingSchema = z.object({
  courtId: z.string().min(1, "Court ID is required"),
  date: z
    .string()
    .regex(dateRegex, "Date must be in YYYY-MM-DD format")
    .refine(
      (val) => {
        const bookingDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return bookingDate >= today;
      },
      { message: "Booking date cannot be in the past" },
    ),
  slots: z
    .array(
      z
        .string()
        .regex(
          timeSlotRegex,
          'Each slot must be in HH:00 format (e.g. "10:00")',
        ),
    )
    .min(1, "At least one time slot is required")
    .max(8, "Cannot book more than 8 slots at once"),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const, {
    error: "Status must be one of: PENDING, CONFIRMED, CANCELLED, COMPLETED",
  }),
});

export const bookingIdParamSchema = z.object({
  id: z.string().min(1, "Booking ID is required"),
});

export const userBookingsQuerySchema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const)
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});
