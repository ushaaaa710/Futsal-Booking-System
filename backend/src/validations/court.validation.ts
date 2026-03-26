// Court validation schemas - Zod schemas for court create and update operations

import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):00$/;

export const createCourtSchema = z
  .object({
    name: z
      .string()
      .min(2, "Court name must be at least 2 characters")
      .max(100, "Court name must be at most 100 characters")
      .trim(),
    type: z.enum(["INDOOR", "OUTDOOR"] as const, {
      error: "Type must be INDOOR or OUTDOOR",
    }),
    hourlyRate: z
      .number()
      .positive("Hourly rate must be a positive number")
      .max(50000, "Hourly rate seems unreasonably high"),
    image: z.string().url("Image must be a valid URL"),
    location: z
      .string()
      .min(2, "Location must be at least 2 characters")
      .max(200)
      .trim()
      .default("Kathmandu"),
    openTime: z
      .string()
      .regex(timeRegex, 'Open time must be in HH:00 format (e.g. "06:00")')
      .default("06:00"),
    closeTime: z
      .string()
      .regex(timeRegex, 'Close time must be in HH:00 format (e.g. "22:00")')
      .default("22:00"),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      const open = parseInt(data.openTime.split(":")[0], 10);
      const close = parseInt(data.closeTime.split(":")[0], 10);
      return close > open;
    },
    { message: "Close time must be after open time", path: ["closeTime"] },
  );

export const updateCourtSchema = z
  .object({
    name: z.string().min(2).max(100).trim().optional(),
    type: z.enum(["INDOOR", "OUTDOOR"] as const).optional(),
    hourlyRate: z.number().positive().max(50000).optional(),
    image: z.string().url().optional(),
    location: z.string().min(2).max(200).trim().optional(),
    openTime: z
      .string()
      .regex(timeRegex, "Open time must be in HH:00 format")
      .optional(),
    closeTime: z
      .string()
      .regex(timeRegex, "Close time must be in HH:00 format")
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.openTime && data.closeTime) {
        const open = parseInt(data.openTime.split(":")[0], 10);
        const close = parseInt(data.closeTime.split(":")[0], 10);
        return close > open;
      }
      return true;
    },
    { message: "Close time must be after open time", path: ["closeTime"] },
  );

export const courtIdParamSchema = z.object({
  id: z.string().min(1, "Court ID is required"),
});
