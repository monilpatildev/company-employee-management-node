import { isObjectIdOrHexString, Types } from "mongoose";
import passwordManager from "../../utils/password.util";
import CompanyDao from "./company.dao";
import { ICompany } from "./company.model";
import addToPipeline from "../../service/pipeline.service";
import { findCompany } from "../../service/findEmpOrCom.service";
class CompanyService {
  private companyDao: CompanyDao;

  constructor() {
    this.companyDao = new CompanyDao();
  }

  public createCompany = async (companyData: ICompany): Promise<any> => {
    try {
      const pipeline: any[] = [
        {
          $match: {
            email: companyData.email,
            name: companyData.name,
          },
        },
      ];

      const existCompany: ICompany[] =
        await this.companyDao.getCompanyByIdOrEmail(pipeline);
      if (existCompany.length) {
        throw {
          status: 400,
          message: "Company is already exist with this email or name!",
        };
      }

      const createCompany = await this.companyDao.createCompany(companyData);
      if (!createCompany) {
        throw { status: 500, message: "Internal server error" };
      }
      return createCompany;
    } catch (error: any) {
      throw error;
    }
  };

  public updateFullCompany = async (
    companyData: any,
    id: string
  ): Promise<any> => {
    try {
      if (!isObjectIdOrHexString(id)) {
        throw { status: 400, message: "Invalid company id" };
      }
      await findCompany(id);
      const pipeline: any[] = [
        {
          $match: {
            email: companyData.email,
            name: companyData.name,
          },
        },
      ];
      const isEmailOrNameExist: ICompany[] =
        await this.companyDao.getCompanyByIdOrEmail(pipeline);
      if (isEmailOrNameExist.length) {
        throw { status: 400, message: "Email or name already used" };
      }
      const updatedCompany = await this.companyDao.updateCompanyById(
        companyData,
        id
      );
      if (!updatedCompany) {
        throw { status: 400, message: "Company not found" };
      }
      return updatedCompany;
    } catch (error: any) {
      throw error;
    }
  };

  public getAllCompaniesDetail = async (query: any): Promise<any> => {
    try {
      const pipeline: any[] = [];
      const queryArray = [query.email, query.name, query.status];
      const fieldsArray = ["email", "name", "status"];

      pipeline.push(addToPipeline(queryArray, fieldsArray));

      pipeline.push({
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          isDeleted: 0,
        },
      });

      return await this.companyDao.getCompanyByIdOrEmail(pipeline);
    } catch (error: any) {
      throw error;
    }
  };

  public getCompanyDetail = async (id: string): Promise<any> => {
    try {
      if (!isObjectIdOrHexString(id)) {
        throw { status: 400, message: "Invalid company id" };
      }
      await findCompany(id);
      const pipeline: any[] = [
        { $match: { _id: new Types.ObjectId(id), isDeleted: false } },
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
        throw { status: 400, message: "No company found!" };
      }
      return companyDetails;
    } catch (error: any) {
      throw error;
    }
  };

  public deleteCompany = async (id: string): Promise<any> => {
    try {
      if (!isObjectIdOrHexString(id)) {
        throw { status: 400, message: "Invalid company id" };
      }
      await findCompany(id);
      const deletedCompany = await this.companyDao.deleteCompanyById(id);
      if (!deletedCompany) {
        throw { status: 400, message: "No company found!" };
      }
      return deletedCompany;
    } catch (error: any) {
      throw error;
    }
  };
}

export default CompanyService;
