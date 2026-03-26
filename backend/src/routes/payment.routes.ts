// Payment routes - POST /payments/topup, /payments/verify

import { Router } from "express";
import * as paymentController from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// POST /api/payments/topup — Initiate wallet top-up
router.post("/topup", paymentController.initiateTopUp);

// POST /api/payments/verify — Verify payment callback
router.post("/verify", paymentController.verifyPayment);

export default router;
