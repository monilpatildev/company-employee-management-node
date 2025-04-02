import { Types } from "mongoose";
import EmployeeDao from "../components/employee/employee.dao";
import CompanyDao from "../components/company/company.dao";

export const findEmployee = async (id: string): Promise<any> => {
  const employeeDao = new EmployeeDao();

  const employeePipeline: any[] = [
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$_id", new Types.ObjectId(id)] },
            { $eq: ["$isDeleted", true] },
          ],
        },
      },
    },
  ];

  const foundEmployee = await employeeDao.getEmployeeByIdOrEmail(
    employeePipeline
  );
  console.log(foundEmployee);

  if (foundEmployee.length) {
    console.log(foundEmployee);
    throw { status: 404, message: "Employee not found!!" };
  }
};

export const findCompany = async (id: string): Promise<any> => {
  const companyDao = new CompanyDao();

  const companyPipeline: any[] = [
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$_id", new Types.ObjectId(id)] },
            { $eq: ["$isDeleted", true] },
          ],
        },
      },
    },
  ];

  const foundCompany = await companyDao.getCompanyByIdOrEmail(companyPipeline);

  if (!foundCompany.length) {
    throw { status: 404, message: "Company not found!" };
  }
};
