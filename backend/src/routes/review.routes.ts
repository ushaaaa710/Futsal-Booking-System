// Review routes - POST /reviews, GET /courts/:courtId/reviews

import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// POST /api/reviews — Submit a review (requires auth)
router.post("/", authenticate, reviewController.createReview);

// GET /api/reviews/court/:courtId — Get reviews for a court (public)
router.get("/court/:courtId", reviewController.getCourtReviews);

export default router;
