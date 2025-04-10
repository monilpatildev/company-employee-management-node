import { Application, Request, Response } from "express";
import authRoute from "../components/auth/auth.route";
import swaggerUi from "swagger-ui-express";
import companyRoutes from "../components/company/company.route";
import employeeRoutes from "../components/employee/employee.route";
import { ResponseHandler } from "../utils/responseHandler.util";
import swaggerSpec from "../utils/swagger";


class InitialRoute {
  static routes = (app: Application): void => {
    app.use("/api", authRoute);
    app.use("/api/companies", companyRoutes);
    app.use("/api/employees", employeeRoutes);
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    app.use("*", (request: Request, response: Response): void => {
      ResponseHandler.error(response, 404, "This endpoint not found");
    });
  };
}

export default InitialRoute;
