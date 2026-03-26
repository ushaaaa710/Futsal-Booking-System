// Unit tests for authentication service - Tests JWT generation, password hashing, validation
// Run with: npx jest --testPathPattern=auth.service

import { generateToken, verifyToken } from "../../services/auth.service";
import mongoose from "mongoose";

const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  name: "Test User",
  email: "test@example.com",
  role: "USER",
} as any;

describe("Auth Service", () => {
  describe("generateToken / verifyToken", () => {
    it("should generate a valid JWT token", () => {
      const token = generateToken(mockUser);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3); // header.payload.signature
    });

    it("should verify and decode a valid token", () => {
      const token = generateToken(mockUser);
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect((decoded as any)._id).toBe(mockUser._id.toString());
    });

    it("should throw on invalid token", () => {
      expect(() => verifyToken("invalid.token.here")).toThrow();
    });
  });

  // registerUser and loginUser require MongoDB — test in integration tests
  describe("registerUser", () => {
    it.todo("should create a new user and return user + token");
    it.todo("should throw on duplicate email");
  });

  describe("loginUser", () => {
    it.todo("should return user + token for valid credentials");
    it.todo("should throw on invalid email");
    it.todo("should throw on invalid password");
  });
});
