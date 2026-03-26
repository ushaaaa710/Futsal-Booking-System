// User service - User data operations and wallet balance calculations

import User from "../models/User";
import { IUser } from "../types/interfaces";

/**
 * Get all users (admin). Excludes passwords.
 */
export const getAllUsers = async (): Promise<IUser[]> => {
  return User.find({}).sort({ createdAt: -1 });
};

/**
 * Get a user by ID.
 */
export const getUserById = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId);
};

/**
 * Update user profile (name, phone, avatar).
 */
export const updateUserProfile = async (
  userId: string,
  data: { name?: string; phone?: string; avatar?: string },
): Promise<IUser | null> => {
  return User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });
};

/**
 * Add funds to user wallet.
 */
export const addToWallet = async (
  userId: string,
  amount: number,
): Promise<IUser | null> => {
  if (amount <= 0) throw new Error("Amount must be positive");
  return User.findByIdAndUpdate(
    userId,
    { $inc: { walletBalance: amount } },
    { new: true },
  );
};

/**
 * Deduct from user wallet.
 */
export const deductFromWallet = async (
  userId: string,
  amount: number,
): Promise<IUser | null> => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.walletBalance < amount) throw new Error("Insufficient balance");
  user.walletBalance -= amount;
  return user.save();
};
