// JWT secret, token expiry, and authentication strategies configuration

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || "courtsync_dev_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  saltRounds: 12,
};

export default authConfig;
