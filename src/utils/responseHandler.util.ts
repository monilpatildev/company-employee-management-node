import { Response } from "express";

class ResponseHandler {
  static success(
    response: Response,
    status: number ,
    message: string,
    data?: any,
    total?: number
  ): Response {
    return response.status(status).json({
      status,
      success: true,
      message,
      data,
      total,
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

class ResponseHandlerThrow {
  static throw(status: number, success: boolean, message: string): never {
    throw {
      status,
      success,
      message,
    };
  }
}

export { ResponseHandler, ResponseHandlerThrow };
