import { Types } from "mongoose";
import EmployeeDao from "../components/employee/employee.dao";
import CompanyDao from "../components/company/company.dao";

export const findEmployee = async (id: string): Promise<void> => {
  const employeeDao = new EmployeeDao();

  const employeePipeline: any[] = [
    { $match: { _id: new Types.ObjectId(id), isDeleted: true } },
  ];

  const foundEmployee = await employeeDao.getEmployeeByIdOrEmail(
    employeePipeline
  );

  if (foundEmployee || foundEmployee.length) {
    throw { status: 400, message: "Employee not found!" };
  }
};

export const findCompany = async (id: string): Promise<void> => {
  const companyDao = new CompanyDao();

  const companyPipeline: any[] = [
    { $match: { _id: new Types.ObjectId(id), isDeleted: true } },
  ];

  const foundCompany = await companyDao.getCompanyByIdOrEmail(companyPipeline);
  console.log(foundCompany);

  if (foundCompany || foundCompany.length) {
    throw { status: 400, message: "Company not found!" };
  }
};
