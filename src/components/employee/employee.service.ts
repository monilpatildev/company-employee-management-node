import passwordManager from "../../utils/passwordManager";
import { ResponseHandlerThrow } from "../../utils/responseHandler";
import EmployeeDao from "./employee.dao";
import { IUser } from "./employee.model";

class EmployeeService {
  private employeeDao: EmployeeDao;

  constructor() {
    this.employeeDao = new EmployeeDao();
  }

  public createEmployee = async (userData: IUser): Promise<any> => {
    try {
      const pipeline: any[] = [
        { $match: { email: userData.email } },
        {
          $project: {
            password: 0,
            __v: 0,
          },
        },
      ];

      const existEmployee = await this.employeeDao.getUserByIdOrEmail(pipeline);
      if (existEmployee.length) {
        ResponseHandlerThrow.throw(
          500,
          false,
          "Employee is already exist with this email!"
        );
      }
      const { firstName, lastName, email, password } = userData;
      const hashedPassword = await passwordManager.hashPassword(password);
      const employee: any = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      };
      const createEmployee = await this.employeeDao.createUser(employee);
      return createEmployee;
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };
}

export default EmployeeService;
