import { Request, Response } from "express";
import validateCompany from "./company.validation";
import { ResponseHandler } from "../../utils/responseHandler.util";
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
  ): Promise<void> => {
    try {
      const validateEmp = await validateCompany(request.body);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        throw { status: 400, message: errorMessages };
      }
      const newCompany = await this.companyService.createCompany(request.body);
      logger.info("Company created successFully!");

      ResponseHandler.success(
        response,
        201,
        "Company created successFully!",
        newCompany
      );
    } catch (error: any) {
      ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public getAllCompanies = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const allCompanies = await this.companyService.getAllCompaniesDetail(
        request.query
      );
      logger.info("Fetch all companies successFully!");

      ResponseHandler.success(
        response,
        200,
        `Fetch  ${allCompanies.length} companies successFully!`,
        allCompanies
      );
    } catch (error: any) {
      ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public updateCompany = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const validateEmp = await validateCompany(request.body);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        throw { status: 400, message: errorMessages };
      }
      const newCompany = await this.companyService.updateFullCompany(
        request.body,
        request.params.id
      );
      logger.info("Company updated successFully!");

      ResponseHandler.success(
        response,
        200,
        "Company updated successFully!",
        newCompany
      );
    } catch (error: any) {
      ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public modifyCompany = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const validateEmp = await validateCompany(request.body, true);
      if (validateEmp.error) {
        const errorMessages = validateEmp.error.details
          .map((detail) => detail.message)
          .join(", ");
        throw { status: 400, message: errorMessages };
      }
      const newCompany = await this.companyService.updateFullCompany(
        request.body,
        request.params.id
      );
      logger.info("Company updated successFully!");
      ResponseHandler.success(
        response,
        200,
        "Company updated successFully!",
        newCompany
      );
    } catch (error: any) {
      ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public getCompany = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
   
      
      const foundCompany = await this.companyService.getCompanyDetail(
        request.params.id
      );
      logger.info("Fetch company successFully!");
      ResponseHandler.success(
        response,
        200,
        "Fetch company successFully!",
        foundCompany[0]
      );
    } catch (error: any) {
      ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };

  public deleteCompany = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const foundCompany = await this.companyService.deleteCompany(
        request.params.id
      );
      logger.info("Company deleted successFully!");

      ResponseHandler.success(response, 200, "Company deleted successFully!");
    } catch (error: any) {
      ResponseHandler.error(
        response,
        error.status || 500,
        error.message || "internal server error"
      );
    }
  };
}

export default new CompanyController();
