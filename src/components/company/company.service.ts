import { isObjectIdOrHexString, Types } from "mongoose";
import CompanyDao from "./company.dao";
import { ICompany } from "./company.model";
import addToPipeline from "../../service/pipeline.service";
import generateTree from "../../service/generateTree.service";

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
      const findCompanyPipeline: any[] = [
        { $match: { _id: createCompany._id } },
        {
          $project: {
            __v: 0,
            isDeleted: 0,
          },
        },
      ];
      const foundCompany = await this.companyDao.getCompanyByIdOrEmail(
        findCompanyPipeline
      );
      return foundCompany;
    } catch (error: any) {
      throw error;
    }
  };

  public updateFullCompany = async (
    companyData: any,
    id: string
  ): Promise<any> => {
    if (!isObjectIdOrHexString(id)) {
      throw { status: 400, message: "Invalid company id" };
    }
    const companyFilter = {
      _id: new Types.ObjectId(id),
      isDeleted: false,
    };
    const companies = await this.companyDao.getCompanyByIdOrEmail([
      { $match: companyFilter },
    ]);
    if (!companies.length) {
      throw { status: 404, message: "Company not found!" };
    }

    const conflictFilter = {
      email: companyData.email,
      name: companyData.name,
      isDeleted: false,
      _id: { $ne: new Types.ObjectId(id) },
    };
    const conflicts = await this.companyDao.getCompanyByIdOrEmail([
      { $match: conflictFilter },
    ]);
    if (conflicts.length) {
      throw { status: 400, message: "Email or name already used" };
    }

    const updatedCompany = await this.companyDao.updateCompanyById(
      companyData,
      id
    );
    if (!updatedCompany) {
      throw { status: 404, message: "Company not found" };
    }

    const finalPipeline = [
      { $match: { _id: updatedCompany._id } },
      { $project: { __v: 0, isDeleted: 0 } },
    ];
    const finalCompany = await this.companyDao.getCompanyByIdOrEmail(
      finalPipeline
    );
    return finalCompany;
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
      const pipeline: any[] = [
        { $match: { _id: new Types.ObjectId(id), isDeleted: false } },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
            isDeleted: 0,
          },
        },
      ];
      const companyDetails: ICompany[] =
        await this.companyDao.getCompanyByIdOrEmail(pipeline);
      if (!companyDetails.length) {
        throw { status: 404, message: "Company not found" };
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
      const deletedCompany = await this.companyDao.deleteCompanyById(id);
      if (!deletedCompany) {
        throw { status: 404, message: "Company not found" };
      }
      return deletedCompany;
    } catch (error: any) {
      throw error;
    }
  };

  public getCompanyTreeDetail = async (id: string): Promise<any> => {
    try {
      if (!isObjectIdOrHexString(id)) {
        throw { status: 400, message: "Invalid company id" };
      }

      const pipeline = [
        {
          $match: {
            _id: new Types.ObjectId(id),
            isDeleted: false,
          },
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
            isDeleted: 0,
            password: 0,
          },
        },
        {
          $lookup: {
            from: "employees",
            localField: "_id",
            foreignField: "companyId",
            as: "employees",
            pipeline: [
              {
                $match: {
                  role: { $ne: "ADMIN" },
                },
              },

              {
                $addFields: {
                  reporter: { $first: "$reporters" },
                },
              },
              {
                $project: {
                  __v: 0,
                  isDeleted: 0,
                  password: 0,
                  createdAt: 0,
                  updatedAt: 0,
                  reporters: 0,
                },
              },
            ],
          },
        },
      ];

      const companyDetails: ICompany[] =
        await this.companyDao.getCompanyByIdOrEmail(pipeline);
      if (!companyDetails.length) {
        throw {
          status: 404,
          message: "Company not found!",
        };
      }
      const companyTree = generateTree(companyDetails[0]);
      companyDetails[0] = companyTree;

      return companyDetails;
    } catch (error: any) {
      throw error;
    }
  };
}

export default CompanyService;
