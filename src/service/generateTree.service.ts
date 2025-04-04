import { Types } from "mongoose";

const generateTree = (companyDetails: any) => {
  const employeeMap: any = {};

  for (const employee of companyDetails.employees) {
    employeeMap[employee._id] = { ...employee, reportee: [] };
    if (employee.reporter) {
      const reporterId = new Types.ObjectId(employee.reporter).toString();
      if (employeeMap[reporterId]) {
        employeeMap[reporterId].reportee!.push(employeeMap[employee._id]);
      }
    }
  }

  const tree: any = Object.values(employeeMap).filter((emp: any) => {
    return !emp.reporter;
  });

  return { ...companyDetails, employees: tree };
};

export default generateTree;
