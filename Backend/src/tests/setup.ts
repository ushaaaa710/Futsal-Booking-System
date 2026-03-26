// Test setup and configuration - Database setup, mock data, test fixtures
// To use: install jest + ts-jest, then reference this in jest.config.ts setupFilesAfterSetup

import mongoose from "mongoose";

const TEST_DB_URI =
  process.env.TEST_MONGODB_URI || "mongodb://localhost:27017/courtsync_test";

/** Connect to a test database before running tests */
export async function setupTestDB(): Promise<void> {
  await mongoose.connect(TEST_DB_URI);
}

/** Drop all collections and disconnect after tests */
export async function teardownTestDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    const collections = await mongoose.connection.db!.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
    await mongoose.disconnect();
  }
}

/** Clear all collections between tests */
export async function clearTestDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    const collections = await mongoose.connection.db!.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
}

/** Sample test data fixtures */
export const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "Password123!",
  phone: "9800000000",
};

export const testAdmin = {
  name: "Test Admin",
  email: "admin@example.com",
  password: "AdminPass123!",
  phone: "9811111111",
  role: "ADMIN" as const,
};
