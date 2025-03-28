
import AuthMiddleware from "../../middleware/authVerification";
import logger from "../../utils/logger";
import passwordManager from "../../utils/passwordManager";
import { ResponseHandlerThrow } from "../../utils/responseHandler";
import EmployeeDao from "../employee/employee.dao";

class AuthService {
  private employeeDao: EmployeeDao;

  constructor() {
    this.employeeDao = new EmployeeDao();
  }

  public authenticateEmployee = async (
    email: string,
    password: string
  ): Promise<any> => {
    try {
      if (!email || !password) {
        ResponseHandlerThrow.throw(404, false, "Email and password required");
      }
      const pipeline = [
        {
          $match: { email: email },
        },
      ];
      const employee = await this.employeeDao.getEmployeeByIdOrEmail(pipeline);
      if (!employee.length) {
        logger.error("invalid email")
        ResponseHandlerThrow.throw(404, false, "Invalid email or password");
      } else {
        const decryptPassword = await passwordManager.comparePassword(
          password,
          employee[0].password
        );

        if (!decryptPassword) {
        logger.error("invalid password")
          ResponseHandlerThrow.throw(404, false, "Invalid email or password");
        }
        const tokens = await AuthMiddleware.createAccessToken(employee[0]);
        return tokens;
      }
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };
}

export default AuthService;
