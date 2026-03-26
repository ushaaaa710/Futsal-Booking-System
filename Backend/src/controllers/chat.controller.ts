// Chat controller - Handles message sending and conversation retrieval

import { Request, Response } from "express";
import * as chatService from "../services/chat.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { getIO } from "../socket";

/**
 * POST /api/chat/messages
 */
export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Not authenticated");
      return;
    }
    const senderId = req.user._id.toString();
    const { receiverId, content, bookingId } = req.body;
    const message = await chatService.sendMessage({
      senderId,
      receiverId,
      content,
      bookingId,
    });

    // Emit via socket.io so both parties get real-time update
    try {
      const io = getIO();
      if (io) {
        io.to(receiverId).emit("newMessage", message);
        io.to(senderId).emit("newMessage", message);
      }
    } catch {
      // Socket not initialized — ignore, REST response still sent
    }

    sendSuccess(res, 201, "Message sent", message);
  } catch (error: any) {
    sendError(res, 500, "Failed to send message", error.message);
  }
};

/**
 * GET /api/chat/conversations
 */
export const getConversations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Not authenticated");
      return;
    }
    const conversations = await chatService.getUserConversations(
      req.user._id.toString(),
    );
    sendSuccess(res, 200, "Conversations retrieved", conversations);
  } catch (error: any) {
    sendError(res, 500, "Failed to get conversations", error.message);
  }
};

/**
 * GET /api/chat/messages/:userId
 */
export const getMessages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Not authenticated");
      return;
    }
    const messages = await chatService.getConversation(
      req.user._id.toString(),
      req.params.userId,
    );
    sendSuccess(res, 200, "Messages retrieved", messages);
  } catch (error: any) {
    sendError(res, 500, "Failed to get messages", error.message);
  }
};
