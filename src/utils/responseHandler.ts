import { Response } from "express";

class ResponseHandler {
  static success(
    res: Response,
    status: number,
    message: string,
    data?: any
  ): Response {
    return res.status(status).json({
      status,
      success: true,
      message,
      data,
    });
  }
  static error(
    res: Response,
    status: number = 500,
    message: string = "Internal server error."
  ): Response {
    return res.status(status).json({
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
