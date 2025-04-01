import jwt from "jsonwebtoken";
import AuthMiddleware from "../../middleware/authVerification";
import logger from "../../utils/logger";
import passwordManager from "../../utils/password.util";
import EmployeeDao from "../employee/employee.dao";
import { ResponseHandler } from "../../utils/responseHandler.util";

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
        throw { status: 400, message: "Email and password required" };
      }

      const pipeline = [{ $match: { email } }];
      const employee = await this.employeeDao.getEmployeeByIdOrEmail(pipeline);

      if (!employee.length) {
        logger.error("Invalid email");
        throw { status: 400, message: "Invalid email or password" };
      }

      const isPasswordValid = await passwordManager.comparePassword(
        password,
        employee[0].password
      );
      if (!isPasswordValid) {
        logger.error("Invalid password");
        throw { status: 400, message: "Invalid email or password" };
      }
      return this.GenerateAccessToken(employee[0]);
    } catch (error) {
      throw error;
    }
  };

  public GenerateAccessToken = async (user: any): Promise<any> => {
    const accessSecretKey = process.env.ACCESS_SECRET_KEY || "Access secret";
    const refreshSecretKey = process.env.REFRESH_SECRET_KEY || "Refresh secret";

    try {
      const accessToken = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
        },
        accessSecretKey,
        { expiresIn: "30m" }
      );
      const refreshToken = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
        },
        refreshSecretKey,
        { expiresIn: "24h" }
      );
      return { accessToken, refreshToken };
    } catch (error: any) {
      throw error;
    }
  };

  public GenerateRefreshToken = async (refreshToken: string): Promise<any> => {
    const refreshSecretKey = process.env.REFRESH_SECRET_KEY || "Refresh secret";

    try {
      const verifyRefreshToken = await jwt.verify(
        refreshToken,
        refreshSecretKey
      );
      const tokens = await this.GenerateAccessToken(verifyRefreshToken);
      return tokens;
    } catch (error: any) {
      throw error;
    }
  };
}

export default AuthService;
