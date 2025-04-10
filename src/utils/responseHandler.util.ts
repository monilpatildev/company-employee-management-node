import { Response } from "express";

export interface ErrorResponse {
  response: Response;
  status: number;
  message: string;
}
export interface SuccessResponse {
  response: Response;
  status: number;
  message: string;
  data?: any;
}

export class ResponseHandler {
  static success(
    response: Response,
    status: number,
    message: string,
    data?: any
  ): Response {
    return response.status(status).json({
      status,
      success: true,
      message,
      data,
    });
  }
  static error(
    response: Response,
    status: number = 500,
    message: string = "Internal server error."
  ): Response {
    return response.status(status).json({
      status,
      success: false,
      message,
    });
  }
}

