// File upload handling - Multer configuration for avatar and court image uploads

import path from "path";

// Allowed image MIME types
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Max file size: 5 MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Upload directory
export const UPLOAD_DIR = path.resolve("uploads");

/**
 * Validate file type.
 */
export const isAllowedFileType = (mimetype: string): boolean => {
  return ALLOWED_IMAGE_TYPES.includes(mimetype);
};

/**
 * Generate a unique filename for uploads.
 */
export const generateFilename = (
  originalName: string,
  prefix: string = "upload",
): string => {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}${ext}`;
};

// Note: Multer middleware setup will be added when the file upload feature is implemented.
// For now, court images use external URLs.
