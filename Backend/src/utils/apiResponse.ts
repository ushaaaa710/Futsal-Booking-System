// Standardized API response formatter - Creates consistent response structure with success/error status

import { Response } from "express";

interface ApiResponsePayload {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
): Response => {
  const payload: ApiResponsePayload = { success: true, message };
  if (data !== undefined) payload.data = data;
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: any,
): Response => {
  const payload: ApiResponsePayload = { success: false, message };
  if (error !== undefined) payload.error = error;
  return res.status(statusCode).json(payload);
};
