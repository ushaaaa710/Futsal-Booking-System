// Reusable validation schemas - Common validation patterns

/**
 * Check if a string is a valid MongoDB ObjectId.
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

/**
 * Check if a string is a valid email.
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Check if a time string is in HH:00 format.
 */
export const isValidTimeSlot = (time: string): boolean => {
  return /^([01]\d|2[0-3]):00$/.test(time);
};

/**
 * Check if a date string is in YYYY-MM-DD format and is a valid date.
 */
export const isValidDate = (dateStr: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

/**
 * Sanitize a string — trim and remove excessive whitespace.
 */
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, " ");
};
