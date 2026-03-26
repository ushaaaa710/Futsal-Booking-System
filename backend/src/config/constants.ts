// Application-wide constants (roles, booking statuses, court types, etc.)

export const BOOKING_STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  CANCELLED: [],
  COMPLETED: [],
};

export const MAX_SLOTS_PER_BOOKING = 8;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export const COURT_OPERATING_DEFAULTS = {
  openTime: "06:00",
  closeTime: "22:00",
};

export default {
  BOOKING_STATUS_TRANSITIONS,
  MAX_SLOTS_PER_BOOKING,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  COURT_OPERATING_DEFAULTS,
};
