// Authentication service - JWT generation, password hashing, and validation logic

import jwt from "jsonwebtoken";
import User from "../models/User";
import { IUser } from "../types/interfaces";
import { UserRole } from "../types/enums";
import { authConfig } from "../config/auth";
import { RegisterInput, LoginInput } from "../validations/auth.validation";

/**
 * Generate a JWT token for a user.
 */
export const generateToken = (user: IUser): string => {
  const payload = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiresIn,
  } as jwt.SignOptions);
};

/**
 * Verify a JWT token and return the decoded payload.
 */
export const verifyToken = (token: string): any => {
  return jwt.verify(token, authConfig.jwtSecret);
};

/**
 * Register a new user.
 * @throws Error if email already exists
 */
export const registerUser = async (
  data: RegisterInput,
): Promise<{ user: IUser; token: string }> => {
  // Check if email already exists
  const existingUser = await User.findOne({ email: data.email } as any);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Create user (password is hashed by the pre-save hook)
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone || null,
    role: UserRole.USER,
    walletBalance: 0,
  } as any);

  // Fetch user without password for response
  const userWithoutPassword = await User.findById(user._id);
  if (!userWithoutPassword) {
    throw new Error("Failed to create user");
  }

  const token = generateToken(userWithoutPassword);
  return { user: userWithoutPassword, token };
};

/**
 * Login an existing user.
 * @throws Error if credentials are invalid
 */
export const loginUser = async (
  data: LoginInput,
): Promise<{ user: IUser; token: string }> => {
  // Find user by email, explicitly select password
  const user = await User.findOne({ email: data.email } as any).select(
    "+password",
  );
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare passwords
  const isMatch = await (user as any).comparePassword(data.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Fetch user without password
  const safeUser = await User.findById(user._id);
  if (!safeUser) {
    throw new Error("User not found");
  }

  const token = generateToken(safeUser);
  return { user: safeUser, token };
};

/**
 * Get user by ID (for /me endpoint).
 * @throws Error if user not found
 */
export const getUserById = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
