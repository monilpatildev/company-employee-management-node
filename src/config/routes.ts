import { Application } from "express";
import authRoute from "../components/auth/auth.route";

class InitialRoute {
  static routes = (app: Application): void => {
    app.use("/api/auth", authRoute);
  };
}

export default InitialRoute;
