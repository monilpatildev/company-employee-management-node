import jwt from "jsonwebtoken";
import { config } from "dotenv";
import {
  ResponseHandler,
  ResponseHandlerThrow,
} from "../utils/responseHandler";
import EmployeeDao from "../components/employee/employee.dao";
import { NextFunction, Request, Response } from "express";
import { Role } from "../common/enums";
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

  public static verifyToken(allowedRoles: Role[]) {
    return async (request: Request, response: Response, next: NextFunction) => {
      try {
        const accessSecretKey: string | any=
          process.env.ACCESS_SECRET_KEY;
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
            const pipeline: any = [
              {
                $match: {
                  email: verifyRefreshToken.email,
                },
              },
            ];
            const employeeData = await this.employeeDao.getEmployeeByIdOrEmail(
              pipeline
            );
            if (!employeeData.length) {
              return ResponseHandlerThrow.throw(404, false, "Invalid token");
            }

            const userRole = employeeData[0].role;

            if (!allowedRoles.includes(userRole)) {
              return ResponseHandlerThrow.throw(
                403,
                false,
                "You cannot access this page"
              );
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
}

export default AuthMiddleware;
