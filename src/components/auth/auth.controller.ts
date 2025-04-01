import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler.util";
import {
  validateEmployee,
  validateEmailPassword,
} from "../employee/employee.validation";
import EmployeeService from "../employee/employee.service";
import EmailVerifyAndSend from "../../service/emailVerifyAndSend";
import AuthService from "./auth.service";
import AuthMiddleware from "../../middleware/authVerification";
import logger from "../../utils/logger";
import { ValidationResult } from "joi";

class AuthController {
  private employeeService: EmployeeService;
  private authService: AuthService;
  private emailVerifyAndSend: EmailVerifyAndSend;

  constructor() {
    this.authService = new AuthService();
    this.employeeService = new EmployeeService();
    this.emailVerifyAndSend = new EmailVerifyAndSend();
  }

  public registerEmployee = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.body) {
        logger.error("No body found");
        ResponseHandler.error(response, 400, "No body found");
      }

      const validationResult: ValidationResult<any> = await validateEmployee(
        request.body
      );
      if (validationResult.error) {
        const errorMessages = validationResult.error.details
          .map((detail) => detail.message)
          .join(", ");
        ResponseHandler.error(response, 400, errorMessages);
      }

      const newEmployee = await this.employeeService.createEmployee(
        request.body
      );

      logger.info("Employee created successfully");
      ResponseHandler.success(
        response,
        201,
        "Employee created successfully!",
        newEmployee
      );
    } catch (error: any) {
      logger.error(error.message);
      ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "Internal server error"
      );
    }
  };

  public verifyEmployeeWithToken = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const { token } = request.params;
      if (!token) {
        ResponseHandler.error(response, 400, "No token found");
      }
      await this.emailVerifyAndSend.verifyMail(token);
      logger.info("Employee verified successfully");
      ResponseHandler.success(response, 200, "Employee verified successfully!");
    } catch (error: any) {
      logger.error(error.message);
      ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "Internal server error"
      );
    }
  };

  public authenticateEmployee = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const validationResult: ValidationResult<any> =
        await validateEmailPassword(request.body);
      if (validationResult.error) {
        const errorMessages = validationResult.error.details
          .map((detail) => detail.message)
          .join(", ");
        throw { status: 400, message: errorMessages };
      }

      const { email, password } = request.body;
      const data = await this.authService.authenticateEmployee(email, password);
      logger.info("Employee authenticated successfully");
      ResponseHandler.success(
        response,
        200,
        "Authenticated successfully!",
        data
      );
    } catch (error: any) {
      logger.error(error.message);
      ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "Internal server error"
      );
    }
  };

  public generateRefreshToken = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const { refreshToken } = request.body;
      if (!refreshToken) {
        ResponseHandler.error(response, 400, "No token found");
      }

      const data = await this.authService.GenerateRefreshToken(refreshToken);
      logger.info("Tokens generated successfully!");

      ResponseHandler.success(
        response,
        201,
        "Tokens generated successfully!",
        data
      );
    } catch (error: any) {
      logger.error(error.message);
      ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "Internal server error"
      );
    }
  };
}

export default new AuthController();
