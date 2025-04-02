import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler.util";
import EmployeeService from "./employee.service";
import { validateEmployee } from "./employee.validation";
import logger from "../../utils/logger";

class EmployeeController {
  private employeeService: EmployeeService;
  constructor() {
    this.employeeService = new EmployeeService();
  }

  public getAllEmployees = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    try {
      const allEmployees = await this.employeeService.getAllEmployeesDetail(
        request.query
      );
      logger.info("Fetch all employees successFully!");
      return ResponseHandler.success(
        response,
        200,
        `Fetch ${allEmployees.length} employees`,
        allEmployees
      );
    } catch (error: any) {
      return ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public updateEmployee = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    try {
      const validateEmp = await validateEmployee(request.body, false, true);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
          return ResponseHandler.error(response, 401, errorMessages);
      }
      const newEmployee = await this.employeeService.updateFullEmployeeDetails(
        request.body,
        request.params.id
      );
      logger.info("Employee updated successFully!");

      return ResponseHandler.success(
        response,
        200,
        "Employee updated successFully!",
        newEmployee
      );
    } catch (error: any) {
      return ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public modifyEmployee = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    try {
      const validateEmp = await validateEmployee(request.body, true, false);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
          return ResponseHandler.error(response, 401, errorMessages);
      }
      const newEmployee = await this.employeeService.modifyEmployeeDetails(
        request.body.companyId,
        request.params.id
      );
      logger.info("Employee updated successFully!");

      return ResponseHandler.success(
        response,
        200,
        "Employee updated successFully!",
        newEmployee
      );
    } catch (error: any) {
      return ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public getEmployee = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    try {
      const foundEmployee = await this.employeeService.getEmployeeDetail(
        request.params.id
      );
      logger.info("Fetch  employee successFully!");
      return ResponseHandler.success(
        response,
        200,
        "Fetch Employee successFully!",
        foundEmployee[0]
      );
    } catch (error: any) {
      return ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public deleteEmployee = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    try {
      const foundEmployee = await this.employeeService.deleteEmployee(
        request.params.id
      );
      logger.info("Employee deleted successFully!");
      return ResponseHandler.success(
        response,
        200,
        "Employee deleted successFully!"
      );
    } catch (error: any) {
      return ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };
}

export default new EmployeeController();
