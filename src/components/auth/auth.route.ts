import { Router } from "express";
import authController from "./auth.controller";
const authRoutes = Router();

authRoutes.post("/register", authController.registerEmployee);
authRoutes.get(
  "/account-verify/:token",
  authController.verifyEmployeeWithToken
);
authRoutes.post("/authenticate", authController.authenticateEmployee);
authRoutes.get("/refresh-token", authController.generateRefreshToken);

export default authRoutes;
