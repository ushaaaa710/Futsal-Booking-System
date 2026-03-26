// Court routes - GET /courts, /courts/:id, POST/PUT/DELETE /courts (admin)

import { Router } from "express";
import * as courtController from "../controllers/court.controller";
import * as timeSlotController from "../controllers/timeSlot.controller";
import { validate } from "../middleware/validation.middleware";
import {
  createCourtSchema,
  updateCourtSchema,
  courtIdParamSchema,
} from "../validations/court.validation";
import { getAvailableSlotsQuerySchema } from "../validations/timeSlot.validation";

// Auth middleware imports — implemented by another team member
import { authenticate } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/role.middleware";

const router = Router();

// ─── Public Routes ──────────────────────────────────────────────
// GET /api/courts — List all active courts
router.get("/", courtController.getAllCourts);

// GET /api/courts/:id — Get a single court
router.get(
  "/:id",
  validate(courtIdParamSchema, "params"),
  courtController.getCourtById,
);

// GET /api/courts/:courtId/slots?date=YYYY-MM-DD — Get all time slots for a court on a date
router.get(
  "/:courtId/slots",
  validate(getAvailableSlotsQuerySchema, "query"),
  timeSlotController.getSlots,
);

// GET /api/courts/:courtId/slots/available?date=YYYY-MM-DD — Get only free slots
router.get(
  "/:courtId/slots/available",
  validate(getAvailableSlotsQuerySchema, "query"),
  timeSlotController.getAvailableSlots,
);

// ─── Admin Routes ───────────────────────────────────────────────
// POST /api/courts — Create a new court
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  validate(createCourtSchema),
  courtController.createCourt,
);

// PUT /api/courts/:id — Update a court
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  validate(courtIdParamSchema, "params"),
  validate(updateCourtSchema),
  courtController.updateCourt,
);

// DELETE /api/courts/:id — Soft-delete a court
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  validate(courtIdParamSchema, "params"),
  courtController.deleteCourt,
);

export default router;
