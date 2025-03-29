import { Request, Response } from "express";
import {
  ResponseHandler,
  ResponseHandlerThrow,
} from "../../utils/responseHandler";
import validateEmployee from "../employee/employee.validation";
import EmployeeService from "../employee/employee.service";
import EmailVerifyAndSend from "../../utils/emailVerifyAndSend";
import AuthService from "./auth.service";
import AuthMiddleware from "../../middleware/authVerification";
import logger from "../../utils/logger";

class AuthController {
  private employeeService = new EmployeeService();
  private authService = new AuthService();
  private emailVerifyAndSend = new EmailVerifyAndSend();

  public registerEmployee = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.body) {
        logger.error("No body found");
        ResponseHandler.error(response, 400, "No body found");
      }

      const validationResult = await validateEmployee(request.body);
      if (validationResult.error) {
        const errorMessages = validationResult.error.details
          .map((detail) => detail.message)
          .join(", ");
        ResponseHandlerThrow.throw(404, false, errorMessages);
      }

      const newEmployee = await this.employeeService.createEmployee(
        request.body
      );
      await this.emailVerifyAndSend.sendEmail(request.body.email);
      ResponseHandler.success(
        response,
        201,
        "Employee created and mail sent successfully!",
        newEmployee
      );
    } catch (error: any) {
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
        ResponseHandler.error(response, 404, "No token found");
      }

      await this.emailVerifyAndSend.verifyMail(token);
      ResponseHandler.success(response, 201, "Employee verified successfully!");
    } catch (error: any) {
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
      if (!request.body) {
        ResponseHandlerThrow.throw(400, false, "No body found");
      }
      console.log(request.body);

      const { email, password } = request.body;
      const data = await this.authService.authenticateEmployee(email, password);
      ResponseHandler.success(
        response,
        201,
        "Authenticated successfully!",
        data
      );
    } catch (error: any) {
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
        ResponseHandlerThrow.throw(400, false, "No token found");
      }

      const data = await AuthMiddleware.createRefreshToken(refreshToken);
      ResponseHandler.success(
        response,
        201,
        "Tokens generated successfully!",
        data
      );
    } catch (error: any) {
      ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "Internal server error"
      );
    }
  };
}

export default new AuthController();
