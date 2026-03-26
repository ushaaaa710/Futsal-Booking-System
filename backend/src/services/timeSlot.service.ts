// TimeSlot service - Dynamic time slot generation based on court hours and existing bookings

import Court from "../models/Court";
import Booking from "../models/Booking";
import { ITimeSlot } from "../types/interfaces";
import { BookingStatus } from "../types/enums";

/**
 * Generate all time slots for a court on a given date.
 * Slots are 1-hour blocks between the court's openTime and closeTime.
 * A slot is marked unavailable if a CONFIRMED or PENDING booking exists
 * for that court + date + time.
 */
export const getAvailableSlots = async (
  courtId: string,
  date: string,
): Promise<ITimeSlot[]> => {
  // 1. Fetch the court to get operating hours and hourly rate
  const court = await Court.findById(courtId);
  if (!court) {
    throw new Error("Court not found");
  }

  const openHour = parseInt(court.openTime.split(":")[0], 10);
  const closeHour = parseInt(court.closeTime.split(":")[0], 10);

  // 2. Fetch all non-cancelled bookings for this court on this date
  const existingBookings = await Booking.find({
    courtId,
    date,
    status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
  });

  // 3. Collect all booked slot times into a Set for O(1) lookups
  const bookedSlots = new Set<string>();
  for (const booking of existingBookings) {
    for (const slot of booking.slots) {
      bookedSlots.add(slot);
    }
  }

  // 4. Generate 1-hour slots from open to close
  const slots: ITimeSlot[] = [];
  for (let hour = openHour; hour < closeHour; hour++) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endHour = hour + 1;
    const endTime = `${endHour.toString().padStart(2, "0")}:00`;

    slots.push({
      id: `${courtId}-${date}-${hour}`,
      startTime,
      endTime,
      isAvailable: !bookedSlots.has(startTime),
      price: court.hourlyRate,
    });
  }

  return slots;
};

/**
 * Get only the available (free) slots for a court on a date.
 * Convenience wrapper that filters out booked slots.
 */
export const getFreeSlots = async (
  courtId: string,
  date: string,
): Promise<ITimeSlot[]> => {
  const allSlots = await getAvailableSlots(courtId, date);
  return allSlots.filter((slot) => slot.isAvailable);
};
