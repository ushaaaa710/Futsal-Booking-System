// Court controller - Handles court CRUD operations and availability queries

import { Request, Response } from "express";
import * as courtService from "../services/court.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { CourtType } from "../types/enums";

/**
 * GET /api/courts
 * List all active courts. Optionally filter by ?type=INDOOR|OUTDOOR
 */
export const getAllCourts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const type = req.query.type as CourtType | undefined;
    const courts = await courtService.getAllCourts({ type });
    sendSuccess(res, 200, "Courts retrieved successfully", courts);
  } catch (err: any) {
    sendError(res, 500, "Failed to retrieve courts", err.message);
  }
};

/**
 * GET /api/courts/:id
 * Get a single court by ID.
 */
export const getCourtById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const court = await courtService.getCourtById(req.params.id);
    if (!court) {
      sendError(res, 404, "Court not found");
      return;
    }
    sendSuccess(res, 200, "Court retrieved successfully", court);
  } catch (err: any) {
    sendError(res, 500, "Failed to retrieve court", err.message);
  }
};

/**
 * POST /api/courts
 * Create a new court (admin only).
 */
export const createCourt = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const court = await courtService.createCourt(req.body);
    sendSuccess(res, 201, "Court created successfully", court);
  } catch (err: any) {
    sendError(res, 500, "Failed to create court", err.message);
  }
};

/**
 * PUT /api/courts/:id
 * Update an existing court (admin only).
 */
export const updateCourt = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const court = await courtService.updateCourt(req.params.id, req.body);
    if (!court) {
      sendError(res, 404, "Court not found");
      return;
    }
    sendSuccess(res, 200, "Court updated successfully", court);
  } catch (err: any) {
    sendError(res, 500, "Failed to update court", err.message);
  }
};

/**
 * DELETE /api/courts/:id
 * Soft-delete a court (admin only). Sets isActive = false.
 */
export const deleteCourt = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const court = await courtService.deleteCourt(req.params.id);
    if (!court) {
      sendError(res, 404, "Court not found");
      return;
    }
    sendSuccess(res, 200, "Court deleted successfully", court);
  } catch (err: any) {
    sendError(res, 500, "Failed to delete court", err.message);
  }
};
