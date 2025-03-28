import { Application } from "express";
import authRoute from "../components/auth/auth.route";
import companyRoutes from "../components/company/company.route";
import AuthMiddleware from "../middleware/authVerification";
import employeeRoutes from "../components/employee/employee.route";
import { Role } from "../common/enums";

class InitialRoute {
  static routes = (app: Application): void => {
    app.use("/api", authRoute);
    app.use(
      "/api/companies",
      AuthMiddleware.verifyToken([Role.ADMIN]),
      companyRoutes
    );
    app.use(
      "/api/employees",
      AuthMiddleware.verifyToken([Role.USER, Role.ADMIN]),
      employeeRoutes
    );
  };
}

export default InitialRoute;
