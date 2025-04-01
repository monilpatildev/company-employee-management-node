import { Router } from "express";
import CompanyController from "./company.controller";
import AuthMiddleware from "../../middleware/authVerification";
import { Role } from "../../common/enums";

const companyRoutes = Router();

companyRoutes.post(
  "/",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.registerCompany
);
companyRoutes.get(
  "/",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.getAllCompanies
);
companyRoutes.put(
  "/:id",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.updateCompany
);
companyRoutes.patch(
  "/:id",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.modifyCompany
);
companyRoutes.get(
  "/:id",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.getCompany
);
companyRoutes.delete(
  "/:id",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.deleteCompany
);

export default companyRoutes;
