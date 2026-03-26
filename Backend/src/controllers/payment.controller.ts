// Payment controller - Handles payment processing, wallet top-up, and transaction verification

import { Request, Response } from "express";
import * as paymentService from "../services/payment.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

/**
 * POST /api/payments/topup
 */
export const initiateTopUp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Not authenticated");
      return;
    }
    const { amount, provider } = req.body;
    if (!amount || amount <= 0) {
      sendError(res, 400, "Amount must be positive");
      return;
    }
    if (!provider || !["esewa", "khalti"].includes(provider)) {
      sendError(res, 400, "Provider must be 'esewa' or 'khalti'");
      return;
    }
    const result = await paymentService.initiateTopUp({
      userId: req.user._id.toString(),
      amount,
      provider,
    });
    sendSuccess(res, 200, "Payment initiated", result);
  } catch (error: any) {
    sendError(res, 500, "Payment initiation failed", error.message);
  }
};

/**
 * POST /api/payments/verify
 */
export const verifyPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { transactionId, provider } = req.body;
    const result = await paymentService.verifyPayment({
      transactionId,
      provider,
    });
    sendSuccess(res, 200, "Payment verification complete", result);
  } catch (error: any) {
    sendError(res, 500, "Payment verification failed", error.message);
  }
};
