// BookingLogic service - Availability checking, double-booking prevention, time slot conflict detection

import Court from "../models/Court";
import Booking from "../models/Booking";
import { BookingStatus } from "../types/enums";
import { ICourt } from "../types/interfaces";

interface AvailabilityResult {
  available: boolean;
  conflicts: string[]; // Slots that are already booked
  reason?: string; // Human-readable rejection reason
}

interface PriceCalculation {
  slotCount: number;
  hourlyRate: number;
  totalPrice: number;
}

/**
 * Validate that the requested court exists and is active.
 */
export const validateCourt = async (courtId: string): Promise<ICourt> => {
  const court = await Court.findById(courtId);
  if (!court) {
    throw new Error("Court not found");
  }
  if (!court.isActive) {
    throw new Error("Court is currently unavailable");
  }
  return court;
};

/**
 * Validate that all requested slots fall within the court's operating hours.
 */
export const validateSlotHours = (
  court: ICourt,
  slots: string[],
): { valid: boolean; invalidSlots: string[] } => {
  const openHour = parseInt(court.openTime.split(":")[0], 10);
  const closeHour = parseInt(court.closeTime.split(":")[0], 10);

  const invalidSlots = slots.filter((slot) => {
    const hour = parseInt(slot.split(":")[0], 10);
    return hour < openHour || hour >= closeHour;
  });

  return {
    valid: invalidSlots.length === 0,
    invalidSlots,
  };
};

/**
 * Validate that the booking date is not in the past.
 */
export const validateBookingDate = (date: string): boolean => {
  const bookingDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookingDate >= today;
};

/**
 * Check if the requested slots are available (no PENDING/CONFIRMED bookings).
 * Returns detailed availability info including which specific slots conflict.
 */
export const checkSlotAvailability = async (
  courtId: string,
  date: string,
  requestedSlots: string[],
): Promise<AvailabilityResult> => {
  // Find all active bookings for this court on this date
  const existingBookings = await Booking.find({
    courtId,
    date,
    status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
  });

  // Collect all already-booked slots
  const bookedSlots = new Set<string>();
  for (const booking of existingBookings) {
    for (const slot of booking.slots) {
      bookedSlots.add(slot);
    }
  }

  // Check for conflicts
  const conflicts = requestedSlots.filter((slot) => bookedSlots.has(slot));

  if (conflicts.length > 0) {
    return {
      available: false,
      conflicts,
      reason: `The following slots are already booked: ${conflicts.join(", ")}`,
    };
  }

  return { available: true, conflicts: [] };
};

/**
 * Calculate the total price for a booking.
 */
export const calculatePrice = (
  hourlyRate: number,
  slots: string[],
): PriceCalculation => {
  return {
    slotCount: slots.length,
    hourlyRate,
    totalPrice: slots.length * hourlyRate,
  };
};

/**
 * Full booking validation pipeline.
 * Runs all checks in sequence and returns the first error or a success result.
 */
export const validateBookingRequest = async (
  courtId: string,
  date: string,
  slots: string[],
): Promise<{
  valid: boolean;
  court?: ICourt;
  totalPrice?: number;
  error?: string;
}> => {
  // 1. Validate court exists and is active
  let court: ICourt;
  try {
    court = await validateCourt(courtId);
  } catch (err: any) {
    return { valid: false, error: err.message };
  }

  // 2. Validate booking date is not in the past
  if (!validateBookingDate(date)) {
    return { valid: false, error: "Booking date cannot be in the past" };
  }

  // 3. Validate slots are within court operating hours
  const hoursCheck = validateSlotHours(court, slots);
  if (!hoursCheck.valid) {
    return {
      valid: false,
      error: `Slots outside operating hours (${court.openTime}-${court.closeTime}): ${hoursCheck.invalidSlots.join(", ")}`,
    };
  }

  // 4. Check for double-booking conflicts
  const availability = await checkSlotAvailability(courtId, date, slots);
  if (!availability.available) {
    return { valid: false, error: availability.reason };
  }

  // 5. Calculate price
  const { totalPrice } = calculatePrice(court.hourlyRate, slots);

  return { valid: true, court, totalPrice };
};
