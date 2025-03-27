import mongoose from "mongoose";
import passwordManager from "../../utils/passwordManager";
import { ResponseHandlerThrow } from "../../utils/responseHandler";
import CompanyDao from "./company.dao";
import { ICompany } from "./company.model";
class CompanyService {
  private companyDao: CompanyDao;

  constructor() {
    this.companyDao = new CompanyDao();
  }

  public createEmployee = async (companyData: ICompany): Promise<any> => {
    try {
      const pipeline: any[] = [{ $match: { email: companyData.email } }];

      const existEmployee: ICompany[] =
        await this.companyDao.getCompanyByIdOrEmail(pipeline);
      if (existEmployee.length) {
        ResponseHandlerThrow.throw(
          500,
          false,
          "Company is already exist with this email!"
        );
      }

      const createCompany = await this.companyDao.createCompany(companyData);
      return createCompany;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };

  public getAllCompaniesDetail = async (): Promise<any> => {
    try {
      const pipeline: any[] = [
        { $match: {} },
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

      return companyDetails;
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
      return companyDetails;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };
}

export default CompanyService;
