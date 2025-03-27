import jwt from "jsonwebtoken";
import {
  ResponseHandler,
  ResponseHandlerThrow,
} from "../utils/responseHandler";
import EmployeeDao from "../components/employee/employee.dao";
import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
config();

class AuthMiddleware {
  private static employeeDao = new EmployeeDao();

  public static createAccessToken = async (user: any): Promise<object> => {
    const accessSecretKey = process.env.ACCESS_SECRET_KEY || "Access secret";
    const refreshSecretKey = process.env.REFRESH_SECRET_KEY || "Refresh secret";

    try {
      const accessToken = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
        },
        accessSecretKey,
        { expiresIn: "30m" }
      );
      const refreshToken = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
        },
        refreshSecretKey,
        { expiresIn: "24h" }
      );
      return { accessToken, refreshToken };
    } catch (error: any) {
      ResponseHandlerThrow.throw(500, false, error);
    }
  };

  public static createRefreshToken = async (
    refreshToken: string
  ): Promise<object> => {
    const refreshSecretKey = process.env.REFRESH_SECRET_KEY || "Refresh secret";

    try {
      const verifyRefreshToken = await jwt.verify(
        refreshToken,
        refreshSecretKey
      );
      const tokens = await this.createAccessToken(verifyRefreshToken);
      return tokens;
    } catch (error: any) {
      ResponseHandlerThrow.throw(401, false, "Invalid token");
    }
  };

  public static verifyToken = async (
    request: any,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const accessSecretKey = process.env.ACCESS_SECRET_KEY || "Access secret";
      const refreshSecretKey =
        process.env.REFRESH_SECRET_KEY || "Refresh secret";

      const accessToken: string | undefined =
        request.headers.authorization?.split(" ")[1];
      if (!accessToken) {
        ResponseHandler.error(response, 401, "Invalid Token");
      } else {
        try {
          const verifyRefreshToken: any = await jwt.verify(
            accessToken,
            accessSecretKey
          );
          request.user = verifyRefreshToken;
          const pipeline: any = [
            {
              $match: {
                email: verifyRefreshToken.email,
              },
            },
          ];
          const employeeData = await this.employeeDao.getUserByIdOrEmail(
            pipeline
          );
          if (employeeData[0].role !== "ADMIN") {
            ResponseHandler.error(response, 403, "You cannot access this page");
          } else {
            next();
          }
        } catch (error: any) {
          console.log("error", error);
          ResponseHandler.error(response, 401, error.message);
        }
      }
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };
}

export default AuthMiddleware;
