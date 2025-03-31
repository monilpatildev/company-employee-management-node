import mongoose from "mongoose";
import passwordManager from "../../utils/password.util";
import { ResponseHandlerThrow } from "../../utils/responseHandler.util";
import CompanyDao from "./company.dao";
import { ICompany } from "./company.model";
import addToPipeline from "../../service/pipeline.service";
class CompanyService {
  private companyDao: CompanyDao;

  constructor() {
    this.companyDao = new CompanyDao();
  }

  public createCompany = async (companyData: ICompany): Promise<any> => {
    try {
      const pipeline: any[] = [{ $match: { email: companyData.email } }];
      const existCompany: ICompany[] =
        await this.companyDao.getCompanyByIdOrEmail(pipeline);
      if (existCompany.length) {
        ResponseHandlerThrow.throw(
          400,
          false,
          "Company is already exist with this email!"
        );
      }

      const createCompany = await this.companyDao.createCompany(companyData);
      if (!createCompany) {
        ResponseHandlerThrow.throw(500, false, "Internal server error");
      }
      return createCompany;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };

  public updateFullCompany = async (
    companyData: any,
    id: string
  ): Promise<any> => {
    try {
      const pipeline: any[] = [{ $match: { email: companyData.email } }];
      const isEmailExist: ICompany[] =
        await this.companyDao.getCompanyByIdOrEmail(pipeline);
      if (isEmailExist.length) {
        ResponseHandlerThrow.throw(400, false, "Email already used");
      }
      const updatedCompany = await this.companyDao.updateCompanyById(
        companyData,
        id
      );
      if (!updatedCompany) {
        ResponseHandlerThrow.throw(400, false, "Company not found");
      }
      return updatedCompany;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };

  public getAllCompaniesDetail = async (query: any): Promise<any> => {
    try {
      const pipeline: any[] = [{ $match: {} }];
      const queryArray = [query.email, query.name, query.status];
      const fieldsArray = ["email", "name", "status"];

      pipeline.push(addToPipeline(queryArray, fieldsArray));

      pipeline.push({
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      });
      console.log(pipeline);

      return await this.companyDao.getCompanyByIdOrEmail(pipeline);
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };

  public getCompanyDetail = async (id: string): Promise<any> => {
    try {
      const pipeline: any[] = [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      ];
      const companyDetails: ICompany[] =
        await this.companyDao.getCompanyByIdOrEmail(pipeline);
      if (!companyDetails.length) {
        ResponseHandlerThrow.throw(400, false, "No company found!");
      }
      return companyDetails;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };

  public deleteCompany = async (id: string): Promise<any> => {
    try {
      const deletedCompany = await this.companyDao.deleteCompanyById(id);
      if (!deletedCompany) {
        ResponseHandlerThrow.throw(400, false, "No company found!");
      }
      return deletedCompany;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };
}

export default CompanyService;
