// Review controller - Handles review submission and retrieval for courts

import { Request, Response } from "express";
import * as reviewService from "../services/review.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

/**
 * POST /api/reviews
 */
export const createReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Not authenticated");
      return;
    }
    const review = await reviewService.createReview({
      userId: req.user._id.toString(),
      courtId: req.body.courtId,
      bookingId: req.body.bookingId,
      rating: req.body.rating,
      comment: req.body.comment,
    });
    sendSuccess(res, 201, "Review submitted", review);
  } catch (error: any) {
    const msg = error.message;
    if (msg.includes("already submitted")) {
      sendError(res, 409, msg);
      return;
    }
    if (msg.includes("not found")) {
      sendError(res, 404, msg);
      return;
    }
    if (msg.includes("only review")) {
      sendError(res, 400, msg);
      return;
    }
    sendError(res, 500, "Failed to submit review", msg);
  }
};

/**
 * GET /api/courts/:courtId/reviews
 */
export const getCourtReviews = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reviews = await reviewService.getCourtReviews(req.params.courtId);
    const rating = await reviewService.getCourtAverageRating(
      req.params.courtId,
    );
    sendSuccess(res, 200, "Reviews retrieved", { reviews, ...rating });
  } catch (error: any) {
    sendError(res, 500, "Failed to get reviews", error.message);
  }
};
