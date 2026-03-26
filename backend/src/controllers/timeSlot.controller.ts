// TimeSlot controller - Handles dynamic time slot generation and availability queries

import { Request, Response } from "express";
import * as timeSlotService from "../services/timeSlot.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

/**
 * GET /api/courts/:courtId/slots?date=YYYY-MM-DD
 * Get all time slots (with availability) for a court on a given date.
 */
export const getSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      sendError(res, 400, 'Query parameter "date" is required (YYYY-MM-DD)');
      return;
    }

    const slots = await timeSlotService.getAvailableSlots(courtId, date);
    sendSuccess(res, 200, "Time slots retrieved successfully", slots);
  } catch (err: any) {
    if (err.message === "Court not found") {
      sendError(res, 404, err.message);
      return;
    }
    sendError(res, 500, "Failed to retrieve time slots", err.message);
  }
};

/**
 * GET /api/courts/:courtId/slots/available?date=YYYY-MM-DD
 * Get only available (free) time slots for a court on a given date.
 */
export const getAvailableSlots = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      sendError(res, 400, 'Query parameter "date" is required (YYYY-MM-DD)');
      return;
    }

    const slots = await timeSlotService.getFreeSlots(courtId, date);
    sendSuccess(res, 200, "Available slots retrieved successfully", slots);
  } catch (err: any) {
    if (err.message === "Court not found") {
      sendError(res, 404, err.message);
      return;
    }
    sendError(res, 500, "Failed to retrieve available slots", err.message);
  }
};
