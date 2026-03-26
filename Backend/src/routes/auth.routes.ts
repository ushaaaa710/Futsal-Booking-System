// Authentication routes - POST /login, /register, GET /me

import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { authenticate } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

// POST /api/auth/register — Create a new user account
router.post("/register", authRateLimiter, validate(registerSchema), authController.register);

// POST /api/auth/login — Login with email and password
router.post("/login", authRateLimiter, validate(loginSchema), authController.login);

// GET /api/auth/me — Get current user profile (requires auth)
router.get("/me", authenticate, authController.getMe);

export default router;
