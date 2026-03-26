// TimeSlot validation schemas - Zod schemas for time slot availability queries

import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const getAvailableSlotsSchema = z.object({
  courtId: z.string().min(1, "Court ID is required"),
  date: z
    .string()
    .regex(dateRegex, "Date must be in YYYY-MM-DD format")
    .refine(
      (val) => {
        const d = new Date(val);
        return !isNaN(d.getTime());
      },
      { message: "Date must be a valid calendar date" },
    ),
});

export const getAvailableSlotsQuerySchema = z.object({
  date: z
    .string()
    .regex(dateRegex, "Date must be in YYYY-MM-DD format")
    .refine(
      (val) => {
        const d = new Date(val);
        return !isNaN(d.getTime());
      },
      { message: "Date must be a valid calendar date" },
    ),
});
