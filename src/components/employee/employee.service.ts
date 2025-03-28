import mongoose from "mongoose";
import passwordManager from "../../utils/passwordManager";
import { ResponseHandlerThrow } from "../../utils/responseHandler";
import EmployeeDao from "./employee.dao";
import { IUser } from "./employee.model";
import { pipeline } from "stream";

class EmployeeService {
  private employeeDao: EmployeeDao;

  constructor() {
    this.employeeDao = new EmployeeDao();
  }

  public createEmployee = async (employeeData: IUser): Promise<any> => {
    try {
      const pipeline: any[] = [
        { $match: { email: employeeData.email } },
        {
          $project: {
            password: 0,
            __v: 0,
          },
        },
      ];

      const existEmployee = await this.employeeDao.getEmployeeByIdOrEmail(
        pipeline
      );
      if (existEmployee.length) {
        ResponseHandlerThrow.throw(
          400,
          false,
          "Employee is already exist with this email!"
        );
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
      return createEmployee;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };

  public updateFullEmployeeDetails = async (
    employeeData: any,
    id: string
  ): Promise<any> => {
    try {
      const updatedEmployee = await this.employeeDao.updateEmployeeById(
        employeeData,
        id
      );
      return updatedEmployee;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };

  public getEmployeeDetail = async (id: string): Promise<any> => {
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
        {
          $lookup: {
            from: "companies",
            localField: "companyId",
            foreignField: "_id",
            as: "company",
          },
        },
        { $unwind: "$company" },
      ];
      const employeeDetails: IUser[] =
        await this.employeeDao.getEmployeeByIdOrEmail(pipeline);

      return employeeDetails;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };

  public deleteEmployee = async (id: string): Promise<any> => {
    try {
      const deleteEmployee = await this.employeeDao.deleteEmployeeById(id);
      return deleteEmployee;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };

  public getAllEmployeesDetail = async (query: any): Promise<any> => {
    try {
      const pipeline: any[] = [
        {
          $match: { email: { $ne: "admin@gmail.com" } },
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
          },
        },
        {
          $match: {},
        },
      ];

      if (query.designation) {
        pipeline.push({
          $match: {
            designation: { $regex: query.designation, $options: "i" },
          },
        });
      }
      if (query.email) {
        pipeline.push({
          $match: {
            email: { $regex: query.email, $options: "i" },
          },
        });
      }
      if (query.name) {
        pipeline.push({
          $match: {
            firstName: { $regex: query.name, $options: "i" },
          },
        });
      }
      if (query.company) {
        pipeline.push({
          $match: {
            company: { $regex: query.company, $options: "i" },
          },
        });
      }

      const employeeDetails: IUser[] =
        await this.employeeDao.getEmployeeByIdOrEmail(pipeline);

      return employeeDetails;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };
}

export default EmployeeService;
