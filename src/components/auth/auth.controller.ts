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
  private employeeService: EmployeeService;
  private authService: AuthService;
  private emailVerifyAndSend: EmailVerifyAndSend;

  constructor() {
    this.employeeService = new EmployeeService();
    this.emailVerifyAndSend = new EmailVerifyAndSend();
    this.authService = new AuthService();
  }

  public registerEmployee = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.body) {
        logger.error("no body found")
        ResponseHandler.error(response, 400, "No body found");
      }
      const validateEmp = await validateEmployee(request.body);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        ResponseHandlerThrow.throw(404, false, errorMessages);
      }
      const newEmployee = await this.employeeService.createEmployee(
        request.body
      );
      const sendMail = await this.emailVerifyAndSend.sendEmail(request.body.email);
      ResponseHandler.success(
        response,
        201,
        "Employee created and mail sent successFully!",
        newEmployee
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

  public verifyEmployeeWithToken = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.params.token) {
        ResponseHandler.error(response, 404, "No token found");
      }
      await this.emailVerifyAndSend.verifyMail(request.params.token);
      ResponseHandler.success(response, 201, "Employee verified successFully!");
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
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
      const { email, password } = request.body;
      const data = await this.authService.authenticateEmployee(email, password);
      ResponseHandler.success(
        response,
        201,
        "Authenticate successFully!",
        data
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

  public generateRefreshToken = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.body.refreshToken) {
        ResponseHandlerThrow.throw(400, false, "No token found");
      }
      const { refreshToken } = request.body;
      const data = await AuthMiddleware.createRefreshToken(refreshToken);
      ResponseHandler.success(
        response,
        201,
        "Tokens generated successFully!",
        data
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };
}

export default new AuthController();
