// Chat routes - GET /messages, POST /messages, GET /conversations

import { Router } from "express";
import * as chatController from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// POST /api/chat/messages — Send a message
router.post("/messages", chatController.sendMessage);

// GET /api/chat/conversations — Get all conversations
router.get("/conversations", chatController.getConversations);

// GET /api/chat/messages/:userId — Get messages with a specific user
router.get("/messages/:userId", chatController.getMessages);

export default router;
