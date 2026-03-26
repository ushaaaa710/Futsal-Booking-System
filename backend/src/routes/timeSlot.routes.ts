// TimeSlot routes - GET /courts/:courtId/slots, /courts/:courtId/slots/available
// NOTE: These routes are mounted inside court.routes.ts since slots are a sub-resource of courts.
// This file is kept as a reference and re-export for clarity.

export { default } from "./court.routes";

// Time slot endpoints are defined in court.routes.ts:
//   GET /api/courts/:courtId/slots?date=YYYY-MM-DD         → All slots with availability
//   GET /api/courts/:courtId/slots/available?date=YYYY-MM-DD → Only free slots
