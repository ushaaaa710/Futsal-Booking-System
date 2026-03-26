// Date and time helper functions - Date formatting, time slot generation, timezone handling

/**
 * Format a Date object to "YYYY-MM-DD" string.
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Get today's date as "YYYY-MM-DD".
 */
export const getToday = (): string => {
  return formatDate(new Date());
};

/**
 * Check if a date string (YYYY-MM-DD) is in the past.
 */
export const isDateInPast = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Check if a date string is today.
 */
export const isToday = (dateStr: string): boolean => {
  return dateStr === getToday();
};

/**
 * Generate an array of hourly time slot strings between open and close hours.
 * E.g., generateSlots("06:00", "10:00") => ["06:00", "07:00", "08:00", "09:00"]
 */
export const generateHourlySlots = (
  openTime: string,
  closeTime: string,
): string[] => {
  const openHour = parseInt(openTime.split(":")[0], 10);
  const closeHour = parseInt(closeTime.split(":")[0], 10);
  const slots: string[] = [];
  for (let h = openHour; h < closeHour; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
  }
  return slots;
};

/**
 * Parse an "HH:00" time string to an hour number.
 */
export const parseHour = (timeStr: string): number => {
  return parseInt(timeStr.split(":")[0], 10);
};

/**
 * Add days to a Date object and return a new Date.
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
