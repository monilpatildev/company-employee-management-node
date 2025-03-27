import { Request, Response } from "express";
import { validateCompany } from "./company.validation";
import {
  ResponseHandler,
  ResponseHandlerThrow,
} from "../../utils/responseHandler";
import CompanyService from "./company.service";

class CompanyController {
  private companyService: CompanyService;
  constructor() {
    this.companyService = new CompanyService();
  }

  public registerCompany = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.body) {
        ResponseHandler.error(response, 400, "No body found");
      }
      const validateEmp = await validateCompany(request.body);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        ResponseHandlerThrow.throw(400, false, errorMessages);
      }

      const newCompany = await this.companyService.createEmployee(request.body);

      ResponseHandler.success(
        response,
        201,
        "Company created successFully!",
        newCompany
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

  public getAllCompanies = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const allCompanies = await this.companyService.getAllCompaniesDetail();
      ResponseHandler.success(
        response,
        201,
        "Fetch all companies successFully!",
        allCompanies,
        allCompanies.length
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

  public updateCompany = async (
    request: Request,
    response: Response
  ): Promise<void> => {};
  public modifyCompany = async (
    request: Request,
    response: Response
  ): Promise<void> => {};
  public getCompany = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.params.id) {
        ResponseHandlerThrow.throw(400, false, "Id required");
      }
      const foundCompany = await this.companyService.getCompanyDetail(
        request.params.id
      );
      ResponseHandler.success(
        response,
        201,
        "Fetch company successFully!",
        foundCompany[0]
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };
  public deleteCompany = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.params.id) {
        ResponseHandlerThrow.throw(400, false, "Id required");
      }
      const foundCompany = await this.companyService.getCompanyDetail(
        request.params.id
      );
      ResponseHandler.success(
        response,
        201,
        "Fetch company successFully!",
        foundCompany[0]
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };
}

export default new CompanyController();
