// Admin routes - GET /admin/stats, /admin/analytics, /admin/users

import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate, authorizeAdmin);

// GET /api/admin/stats — Dashboard overview statistics
router.get("/stats", adminController.getDashboardStats);

// GET /api/admin/analytics/bookings — Booking analytics by day
router.get("/analytics/bookings", adminController.getBookingAnalytics);

// GET /api/admin/users — List all users
router.get("/users", adminController.getAllUsers);

export default router;
