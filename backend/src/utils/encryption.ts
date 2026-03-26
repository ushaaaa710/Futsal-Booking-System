// Encryption utilities - Password hashing with bcrypt, data encryption/decryption helpers

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plaintext password with a hashed password.
 */
export const comparePassword = async (
  plaintext: string,
  hashed: string,
): Promise<boolean> => {
  return bcrypt.compare(plaintext, hashed);
};
