import "dotenv/config";
import http from "http";
import mongoose from "mongoose";
import app from "./app";
import { connectDB } from "./config/database";
import { initSocket } from "./socket";

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to MongoDB (non-fatal: server still starts so it can return errors)
  try {
    await connectDB();
  } catch (error) {
    console.error(
      "⚠ Starting without database. API requests will fail until MongoDB is available.",
    );
    console.error("  Check MONGODB_URI in .env and Atlas IP whitelist.");
  }

  // Create HTTP server and attach Socket.io
  const server = http.createServer(app);
  initSocket(server);

  // Start listening regardless of DB status
  server.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API endpoints available at http://localhost:${PORT}/api`);
    console.log(`✓ Health check: http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully...");
    server.close(async () => {
      await mongoose.connection.close();
      console.log("✓ Server and database connection closed");
      process.exit(0);
    });
  });
}

startServer();
