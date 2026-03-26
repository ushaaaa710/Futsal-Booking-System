// Central route aggregator - Combines all route modules and exports main router

import { Router } from "express";
import authRoutes from "./auth.routes";
import courtRoutes from "./court.routes";
import bookingRoutes from "./booking.routes";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";
import chatRoutes from "./chat.routes";
import paymentRoutes from "./payment.routes";
import reviewRoutes from "./review.routes";

const router = Router();

// Mount domain routes
router.use("/auth", authRoutes); // /api/auth/*
router.use("/courts", courtRoutes); // /api/courts/*
router.use("/bookings", bookingRoutes); // /api/bookings/*
router.use("/users", userRoutes); // /api/users/*
router.use("/admin", adminRoutes); // /api/admin/*
router.use("/chat", chatRoutes); // /api/chat/*
router.use("/payments", paymentRoutes); // /api/payments/*
router.use("/reviews", reviewRoutes); // /api/reviews/*

export default router;
