import { Router } from "express";
import CompanyController from "./company.controller";
import AuthMiddleware from "../../middleware/authVerification";
import { Role } from "../../common/enums";

const companyRoutes = Router();

companyRoutes.post(
  "/",
  AuthMiddleware.verifyToken([Role.ADMIN]),
  CompanyController.registerCompany
);
companyRoutes.get(
  "/",
  AuthMiddleware.verifyToken([Role.ADMIN]),
  CompanyController.getAllCompanies
);
companyRoutes.put(
  "/:id",
  AuthMiddleware.verifyToken([Role.ADMIN]),
  CompanyController.updateCompany
);
companyRoutes.patch(
  "/:id",
  AuthMiddleware.verifyToken([Role.ADMIN]),
  CompanyController.modifyCompany
);
companyRoutes.get(
  "/:id",
  AuthMiddleware.verifyToken([Role.ADMIN]),
  CompanyController.getCompany
);
companyRoutes.delete(
  "/:id",
  AuthMiddleware.verifyToken([Role.ADMIN]),
  CompanyController.deleteCompany
);

export default companyRoutes;
