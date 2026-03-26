// Real-time chat WebSocket handler - Manages chat message sending and receiving via Socket.io

import { Server, Socket } from "socket.io";
import * as chatService from "../services/chat.service";

export function setupChatSocket(io: Server, socket: Socket): void {
  // Join a room based on the user's ID (sent on connect)
  socket.on("join", (userId: string) => {
    socket.join(userId);
    console.log(`[Chat Socket] User ${userId} joined their room`);
  });

  // Handle sending a message
  socket.on(
    "sendMessage",
    async (data: {
      senderId: string;
      receiverId: string;
      content: string;
      bookingId?: string;
    }) => {
      try {
        const message = await chatService.sendMessage({
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
          bookingId: data.bookingId,
        });

        // Emit to the receiver's room
        io.to(data.receiverId).emit("newMessage", message);
        // Also emit back to the sender's room for confirmation
        io.to(data.senderId).emit("newMessage", message);
      } catch (error) {
        socket.emit("messageError", { error: "Failed to send message" });
      }
    },
  );

  // Mark messages as read
  socket.on(
    "markAsRead",
    async (data: { senderId: string; receiverId: string }) => {
      try {
        await chatService.markAsRead(data.senderId, data.receiverId);
        io.to(data.senderId).emit("messagesRead", { by: data.receiverId });
      } catch (error) {
        console.error("[Chat Socket] Error marking messages as read:", error);
      }
    },
  );
}
