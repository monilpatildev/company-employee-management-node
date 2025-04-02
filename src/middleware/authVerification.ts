import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { ResponseHandler } from "../utils/responseHandler.util";
import EmployeeDao from "../components/employee/employee.dao";
import { NextFunction, Request, response, Response } from "express";
import { Role } from "../common/enums";
config();

class AuthMiddleware {
  private static employeeDao = new EmployeeDao();

  public static authenticate(allowedRoles: Role[]) {
    return async (
      request: Request,
      response: Response,
      next: NextFunction
    ): Promise<any> => {
      try {
        const accessSecretKey: string | any = process.env.ACCESS_SECRET_KEY;
        const accessToken: string | undefined =
          request.headers.authorization?.split(" ")[1];
        if (!accessToken) {
          return ResponseHandler.error(response, 401, "Invalid token");
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
              return ResponseHandler.error(response, 401, "Invalid token");
            }
            const userRole = employeeData[0].role;

            if (!allowedRoles.includes(userRole)) {
              return ResponseHandler.error(
                response,
                403,
                "You cannot access this api"
              );
            } else {
              next();
            }
          } catch (error: any) {
            if (error.name === "TokenExpiredError") {
              return ResponseHandler.error(
                response,
                401,
                "Session expired,Please login again"
              );
            }
            return ResponseHandler.error(response, 401, error.message);
          }
        }
      } catch (error: any) {
        return ResponseHandler.error(response, error.status, error.message);
      }
    };
  }
}

export default AuthMiddleware;
