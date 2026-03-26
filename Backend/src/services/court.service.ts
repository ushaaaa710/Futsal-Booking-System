// Court service - Court search, filtering, and availability checking logic

import Court from "../models/Court";
import { ICourt } from "../types/interfaces";
import { CourtType } from "../types/enums";

/**
 * Get all active courts, optionally filtered by type.
 */
export const getAllCourts = async (filters?: {
  type?: CourtType;
  isActive?: boolean;
}): Promise<ICourt[]> => {
  const query: Record<string, any> = {};

  if (filters?.type) query.type = filters.type;
  // Default to only active courts unless explicitly asked
  query.isActive = filters?.isActive !== undefined ? filters.isActive : true;

  return Court.find(query).sort({ createdAt: -1 });
};

/**
 * Get a single court by ID.
 */
export const getCourtById = async (id: string): Promise<ICourt | null> => {
  return Court.findById(id);
};

/**
 * Create a new court (admin only).
 */
export const createCourt = async (data: {
  name: string;
  type: CourtType;
  hourlyRate: number;
  image: string;
  location?: string;
  openTime?: string;
  closeTime?: string;
}): Promise<ICourt> => {
  const court = new Court(data);
  return court.save();
};

/**
 * Update an existing court by ID (admin only).
 */
export const updateCourt = async (
  id: string,
  data: Partial<{
    name: string;
    type: CourtType;
    hourlyRate: number;
    image: string;
    location: string;
    openTime: string;
    closeTime: string;
    isActive: boolean;
  }>,
): Promise<ICourt | null> => {
  return Court.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

/**
 * Delete a court by ID (admin only).
 * Performs a soft-delete by setting isActive = false.
 */
export const deleteCourt = async (id: string): Promise<ICourt | null> => {
  return Court.findByIdAndUpdate(id, { isActive: false }, { new: true });
};
