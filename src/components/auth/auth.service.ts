import AuthMiddleware from "../../middleware/authVerification";
import logger from "../../utils/logger";
import passwordManager from "../../utils/passwordManager";
import { ResponseHandlerThrow } from "../../utils/responseHandler";
import EmployeeDao from "../employee/employee.dao";

class AuthService {
  private employeeDao = new EmployeeDao();

  public authenticateEmployee = async (
    email: string,
    password: string
  ): Promise<any> => {
    if (!email || !password) {
      ResponseHandlerThrow.throw(400, false, "Email and password required");
    }

    const pipeline = [{ $match: { email } }];
    const employee = await this.employeeDao.getEmployeeByIdOrEmail(pipeline);

    if (!employee.length) {
      logger.error("Invalid email");
      ResponseHandlerThrow.throw(400, false, "Invalid email or password");
    }

    const isPasswordValid = await passwordManager.comparePassword(
      password,
      employee[0].password
    );
    if (!isPasswordValid) {
      logger.error("Invalid password");
      ResponseHandlerThrow.throw(400, false, "Invalid email or password");
    }

    return AuthMiddleware.createAccessToken(employee[0]);
  };
}

export default AuthService;
