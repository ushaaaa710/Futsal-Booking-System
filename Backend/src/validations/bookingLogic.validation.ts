// Booking logic validation - Business rule validators for booking conflicts and availability

import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeSlotRegex = /^([01]\d|2[0-3]):00$/;

/**
 * Schema for checking availability of specific slots.
 * Used internally by the bookingLogic service before confirming a booking.
 */
export const checkAvailabilitySchema = z.object({
  courtId: z.string().min(1, "Court ID is required"),
  date: z
    .string()
    .regex(dateRegex, "Date must be in YYYY-MM-DD format")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Date must be a valid calendar date",
    }),
  slots: z
    .array(z.string().regex(timeSlotRegex, "Each slot must be in HH:00 format"))
    .min(1, "At least one slot is required"),
});

/**
 * Schema for validating that requested slots fall within court operating hours.
 */
export const courtHoursSchema = z
  .object({
    openTime: z.string().regex(timeSlotRegex),
    closeTime: z.string().regex(timeSlotRegex),
    requestedSlots: z.array(z.string().regex(timeSlotRegex)),
  })
  .refine(
    (data) => {
      const open = parseInt(data.openTime.split(":")[0], 10);
      const close = parseInt(data.closeTime.split(":")[0], 10);
      return data.requestedSlots.every((slot) => {
        const hour = parseInt(slot.split(":")[0], 10);
        return hour >= open && hour < close;
      });
    },
    { message: "One or more slots are outside court operating hours" },
  );
