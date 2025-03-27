import { Application } from "express";
import authRoute from "../components/auth/auth.route";
import companyRoutes from "../components/company/company.route";
import AuthMiddleware from "../middleware/authVerification";

class InitialRoute {
  static routes = (app: Application): void => {
    app.use("/api", authRoute);
    app.use("/api/companies", AuthMiddleware.verifyToken, companyRoutes);
  };
}

export default InitialRoute;
