import { Request, Response } from "express";
import {
  ResponseHandler,
  ResponseHandlerThrow,
} from "../../utils/responseHandler";
import EmployeeService from "./employee.service";
import validateEmployee from "./employee.validation";

class EmployeeController {
  private employeeService: EmployeeService;
  constructor() {
    this.employeeService = new EmployeeService();
  }

  public getAllEmployees = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const allEmployees = await this.employeeService.getAllEmployeesDetail(request.query);
      ResponseHandler.success(
        response,
        200,
        `Fetch ${allEmployees.length} employees`,
        allEmployees
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

  public updateEmployee = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.body && !request.params.id) {
        ResponseHandlerThrow.throw(400, false, "No body or id found");
      }
      const validateEmp = await validateEmployee(request.body, false, true);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        ResponseHandlerThrow.throw(400, false, errorMessages);
      }
      const newEmployee = await this.employeeService.updateFullEmployeeDetails(
        request.body,
        request.params.id
      );
      if (!newEmployee) {
        ResponseHandlerThrow.throw(400, false, "No employee found!");
      }
      ResponseHandler.success(
        response,
        200,
        "Employee updated successFully!",
        newEmployee
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

  public modifyEmployee = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.body && !request.params.id) {
        ResponseHandlerThrow.throw(400, false, "No body or id found");
      }
      const validateEmp = await validateEmployee(request.body, true, false);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        ResponseHandlerThrow.throw(400, false, errorMessages);
      }
      const newEmployee = await this.employeeService.updateFullEmployeeDetails(
        request.body,
        request.params.id
      );
      if (!newEmployee) {
        ResponseHandlerThrow.throw(400, false, "No employee found!");
      }
      ResponseHandler.success(
        response,
        200,
        "Employee updated successFully!",
        newEmployee
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

  public getEmployee = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.params.id) {
        ResponseHandlerThrow.throw(400, false, "Id required");
      }
      const foundEmployee = await this.employeeService.getEmployeeDetail(
        request.params.id
      );
      if (!foundEmployee.length) {
        ResponseHandlerThrow.throw(400, false, "No employee found!");
      }
      ResponseHandler.success(
        response,
        200,
        "Fetch Employee successFully!",
        foundEmployee[0]
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

  public deleteEmployee = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.params.id) {
        ResponseHandlerThrow.throw(400, false, "Id required");
      }
      const foundCompany = await this.employeeService.deleteEmployee(
        request.params.id
      );
      if (!foundCompany) {
        ResponseHandlerThrow.throw(400, false, "No employee found!");
      }
      ResponseHandler.success(response, 200, "Employee deleted successFully!");
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };
}

export default new EmployeeController();
