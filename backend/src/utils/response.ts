import { Response } from "express";

export function successResponse(
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(
  res: Response,
  statusCode: number,
  message: string
) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}