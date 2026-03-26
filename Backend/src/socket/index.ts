// Socket.io setup and initialization - Configures WebSocket server and connection handling

import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { setupChatSocket } from "./chat.socket";

let io: SocketServer | null = null;

export function initSocket(httpServer: HttpServer): void {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    setupChatSocket(io!, socket);

    socket.on("disconnect", () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  console.log("✓ WebSocket server initialized");
}

export function getIO(): SocketServer | null {
  return io;
}
