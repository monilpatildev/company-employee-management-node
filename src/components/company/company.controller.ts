import { Request, Response } from "express";
import validateCompany from "./company.validation";
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
        ResponseHandlerThrow.throw(400, false, "No body found");
      }
      const validateEmp = await validateCompany(request.body);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        ResponseHandlerThrow.throw(400, false, errorMessages);
      }
      const newCompany = await this.companyService.createCompany(request.body);
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
  ): Promise<void> => {
    try {
      if (!request.body && !request.params.id) {
        ResponseHandlerThrow.throw(400, false, "No body or id found");
      }
      const validateEmp = await validateCompany(request.body);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        ResponseHandlerThrow.throw(400, false, errorMessages);
      }
      const newCompany = await this.companyService.updateFullCompany(
        request.body,
        request.params.id
      );
      ResponseHandler.success(
        response,
        201,
        "Company updated successFully!",
        newCompany
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

  public modifyCompany = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.body && !request.params.id) {
        ResponseHandlerThrow.throw(400, false, "No body or id found");
      }
      const validateEmp = await validateCompany(request.body, true);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        ResponseHandlerThrow.throw(400, false, errorMessages);
      }
      const newCompany = await this.companyService.updateFullCompany(
        request.body,
        request.params.id
      );
      ResponseHandler.success(
        response,
        201,
        "Company updated successFully!",
        newCompany
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

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
      
      if (!foundCompany.length) {
        ResponseHandlerThrow.throw(400, false, "No company found!");
      }
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
      const foundCompany = await this.companyService.deleteCompany(
        request.params.id
      );
      if (!foundCompany) {
        ResponseHandlerThrow.throw(400, false, "No company found!");
      }
      ResponseHandler.success(response, 201, "Company deleted successFully!");
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };
}

export default new CompanyController();
