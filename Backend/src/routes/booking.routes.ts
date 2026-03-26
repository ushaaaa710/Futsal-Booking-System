// Booking routes - GET/POST /bookings, PUT/DELETE /bookings/:id

import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { validate } from "../middleware/validation.middleware";
import {
  createBookingSchema,
  updateBookingStatusSchema,
  bookingIdParamSchema,
} from "../validations/booking.validation";

// Auth middleware imports — implemented by another team member
import { authenticate } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/role.middleware";

const router = Router();

// All booking routes require authentication
router.use(authenticate);

// ─── User Routes ────────────────────────────────────────────────
// POST /api/bookings — Create a new booking
router.post(
  "/",
  validate(createBookingSchema),
  bookingController.createBooking,
);

// GET /api/bookings/my — Get current user's bookings
router.get("/my", bookingController.getMyBookings);

// GET /api/bookings/:id — Get a single booking by ID
router.get(
  "/:id",
  validate(bookingIdParamSchema, "params"),
  bookingController.getBookingById,
);

// PATCH /api/bookings/:id/cancel — Cancel own booking
router.patch(
  "/:id/cancel",
  validate(bookingIdParamSchema, "params"),
  bookingController.cancelBooking,
);

// ─── Admin Routes ───────────────────────────────────────────────
// GET /api/bookings — Get all bookings (admin only)
router.get("/", authorizeAdmin, bookingController.getAllBookings);

// PATCH /api/bookings/:id/status — Update booking status (admin only)
router.patch(
  "/:id/status",
  authorizeAdmin,
  validate(bookingIdParamSchema, "params"),
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus,
);

export default router;
