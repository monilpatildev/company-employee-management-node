import { Request, Response } from "express";
import validateCompany from "./company.validation";
import {
  ErrorResponse,
  ResponseHandler,
  SuccessResponse,
} from "../../utils/responseHandler.util";
import CompanyService from "./company.service";
import logger from "../../utils/logger";

class CompanyController {
  private companyService: CompanyService;
  constructor() {
    this.companyService = new CompanyService();
  }

  public registerCompany = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    try {
      const validateEmp = validateCompany(request.body);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        return ResponseHandler.error(response, 400, errorMessages);
      }
      const newCompany = await this.companyService.createCompany(request.body);
      logger.info("Company created successFully!");

      return ResponseHandler.success(
        response,
        201,
        "Company created successFully!",
        newCompany
      );
    } catch (error: any) {
      return ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public getAllCompanies = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    try {
      const allCompanies = await this.companyService.getAllCompaniesDetail(
        request.query
      );
      logger.info("Fetch all companies successFully!");

      return ResponseHandler.success(
        response,
        200,
        `Fetch  ${allCompanies.length} companies successFully!`,
        allCompanies
      );
    } catch (error: any) {
      return ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public updateCompany = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    try {
      const validateEmp = await validateCompany(request.body);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        return ResponseHandler.error(response, 401, errorMessages);
      }
      const newCompany = await this.companyService.updateFullCompany(
        request.body,
        request.params.id
      );
      logger.info("Company updated successFully!");

      return ResponseHandler.success(
        response,
        200,
        "Company updated successFully!",
        newCompany
      );
    } catch (error: any) {
      return ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public modifyCompany = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    try {
      const validateEmp = await validateCompany(request.body, true);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        return ResponseHandler.error(response, 401, errorMessages);
      }
      const newCompany = await this.companyService.updateFullCompany(
        request.body,
        request.params.id
      );
      logger.info("Company updated successFully!");
      return ResponseHandler.success(
        response,
        200,
        "Company updated successFully!",
        newCompany
      );
    } catch (error: any) {
      return ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public getCompany = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    try {
      const foundCompany = await this.companyService.getCompanyDetail(
        request.params.id
      );
      logger.info("Fetch company successFully!");
      return ResponseHandler.success(
        response,
        200,
        "Fetch company successFully!",
        foundCompany[0]
      );
    } catch (error: any) {
      return ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public deleteCompany = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    try {
      const foundCompany = await this.companyService.deleteCompany(
        request.params.id
      );
      logger.info("Company deleted successFully!");

      return ResponseHandler.success(
        response,
        200,
        "Company deleted successFully!"
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

export default new CompanyController();
