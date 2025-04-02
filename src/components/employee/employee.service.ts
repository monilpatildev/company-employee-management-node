import passwordManager from "../../utils/password.util";
import EmployeeDao from "./employee.dao";
import { IUser } from "./employee.model";
import addToPipeline from "../../service/pipeline.service";
import CompanyDao from "../company/company.dao";
import { findEmployee } from "../../service/findEmpOrCom.service";
import { isObjectIdOrHexString, Types } from "mongoose";
import EmailVerifyAndSend from "../../service/emailVerifyAndSend";

class EmployeeService {
  private employeeDao: EmployeeDao;
  private companyDao: CompanyDao;
  private emailVerifyAndSend: EmailVerifyAndSend;

  constructor() {
    this.employeeDao = new EmployeeDao();
    this.companyDao = new CompanyDao();
    this.emailVerifyAndSend = new EmailVerifyAndSend();
  }

  public createEmployee = async (employeeData: IUser): Promise<any> => {
    try {
      const pipeline: any[] = [{ $match: { email: employeeData.email } }];

      const existEmployee = await this.employeeDao.getEmployeeByIdOrEmail(
        pipeline
      );
      if (existEmployee.length) {
        throw { status: 400, message: "Email is already used" };
      }
      const { firstName, lastName, email, password } = employeeData;
      const hashedPassword = await passwordManager.hashPassword(password);
      const employee: any = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      };
      const createEmployee = await this.employeeDao.createEmployee(employee);
      if (!createEmployee) {
        throw { status: 500, message: "Internal server error" };
      }
      await this.emailVerifyAndSend.sendEmail(email);
      const findEmployeePipeline: any[] = [
        { $match: { _id: createEmployee._id } },
        {
          $project: {
            __v: 0,
            isDeleted: 0,
            password: 0,
            role: 0,
          },
        },
      ];
      const foundEmployee = await this.employeeDao.getEmployeeByIdOrEmail(
        findEmployeePipeline
      );
      return foundEmployee;
    } catch (error: any) {
      throw error;
    }
  };

  public updateFullEmployeeDetails = async (
    employeeData: any,
    id: string
  ): Promise<any> => {
    try {
      if (!isObjectIdOrHexString(id)) {
        throw { status: 400, message: "Invalid employee id" };
      }
      await findEmployee(id);
      const pipeline: any[] = [{ $match: { email: employeeData.email } }];
      const foundEmail = await this.employeeDao.getEmployeeByIdOrEmail(
        pipeline
      );
      if (foundEmail.length) {
        throw { status: 400, message: "Email already used" };
      }
      const updatedEmployee = await this.employeeDao.updateEmployeeById(
        employeeData,
        id
      );
      if (!updatedEmployee) {
        throw { status: 500, message: "Internal server error" };
      }
      const findEmployeePipeline: any[] = [
        { $match: { _id: updatedEmployee._id } },
        {
          $project: {
            __v: 0,
            isDeleted: 0,
            password: 0,
            role: 0,
          },
        },
      ];
      const foundEmployee = await this.employeeDao.getEmployeeByIdOrEmail(
        findEmployeePipeline
      );
      return foundEmployee;
    } catch (error: any) {
      throw error;
    }
  };

  public modifyEmployeeDetails = async (
    companyId: any,
    id: string
  ): Promise<any> => {
    try {
      if (!isObjectIdOrHexString(id)) {
        throw { status: 400, message: "Invalid employee id" };
      }
      await findEmployee(id);
      const companyPipeline: any[] = [
        { $match: { _id: new Types.ObjectId(companyId) } },
      ];

      const foundCompany = await this.companyDao.getCompanyByIdOrEmail(
        companyPipeline
      );

      if (!foundCompany.length) {
        throw { status: 404, message: "Company not found!" };
      }
      const updatedEmployee = await this.employeeDao.updateEmployeeById(
        companyId,
        id
      );
      if (!updatedEmployee) {
        throw { status: 500, message: "Internal server error" };
      }
      const findEmployeePipeline: any[] = [
        { $match: { _id: updatedEmployee._id } },
        {
          $project: {
            __v: 0,
            isDeleted: 0,
            password: 0,
            role: 0,
          },
        },
      ];
      const foundEmployee = await this.employeeDao.getEmployeeByIdOrEmail(
        findEmployeePipeline
      );
      return foundEmployee;
    } catch (error: any) {
      throw error;
    }
  };

  public getEmployeeDetail = async (id: string): Promise<any> => {
    try {
      if (!isObjectIdOrHexString(id)) {
        throw { status: 400, message: "Invalid employee id" };
      }

      const pipeline: any[] = [
        { $match: { _id: new Types.ObjectId(id), isDeleted: false } },

        {
          $lookup: {
            from: "companies",
            localField: "companyId",
            foreignField: "_id",
            as: "company",
            pipeline: [
              {
                $project: {
                  __v: 0,
                  isDeleted: 0,
                },
              },
            ],
          },
        },
        { $unwind: "$company" },
        {
          $project: {
            __v: 0,
            isDeleted: 0,
            role: 0,
            password: 0,
            companyId: 0,
          },
        },
      ];
      const employeeDetails: IUser[] =
        await this.employeeDao.getEmployeeByIdOrEmail(pipeline);
      if (!employeeDetails.length) {
        throw { status: 404, message: "Employee not found!" };
      }
      return employeeDetails;
    } catch (error: any) {
      throw error;
    }
  };

  public deleteEmployee = async (id: string): Promise<any> => {
    try {
      if (!isObjectIdOrHexString(id)) {
        throw { status: 400, message: "Invalid employee id" };
      }
      const deleteEmployee = await this.employeeDao.deleteEmployeeById(id);

      if (!deleteEmployee) {
        throw { status: 404, message: "Employee not found!" };
      }
      return deleteEmployee;
    } catch (error: any) {
      throw error;
    }
  };

  public getAllEmployeesDetail = async (query: any): Promise<any> => {
    try {
      const pipeline: any[] = [];

      const queryArray = [query.designation, query.email, query.name];
      const fieldsArray = ["designation", "email", "firstName"];

      pipeline.push(addToPipeline(queryArray, fieldsArray));

      pipeline.push(
        {
          $match: { role: { $ne: "ADMIN" } },
        },
        {
          $lookup: {
            from: "companies",
            localField: "companyId",
            foreignField: "_id",
            as: "company",
            pipeline: [
              {
                $project: {
                  name: 1,
                  _id: 0,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            company: "$company.name",
          },
        },
        {
          $unwind: "$company",
        },
        {
          $project: {
            __v: 0,
            companyId: 0,
            role: 0,
            isDeleted: 0,
          },
        }
      );

      if (query.company) {
        pipeline.push({
          $match: { company: { $regex: query.company, $options: "i" } },
        });
      }

      return this.employeeDao.getEmployeeByIdOrEmail(pipeline);
    } catch (error: any) {
      throw error;
    }
  };
}

export default EmployeeService;
