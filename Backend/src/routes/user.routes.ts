// User routes - GET/PUT /users/:id, /users/:id/wallet

import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// GET /api/users — List all users
router.get("/", userController.getAllUsers);

// GET /api/users/:id — Get user profile
router.get("/:id", userController.getUserById);

// PUT /api/users/:id — Update user profile
router.put("/:id", userController.updateProfile);

// POST /api/users/:id/wallet/topup — Add funds to wallet
router.post("/:id/wallet/topup", userController.topUpWallet);

export default router;
