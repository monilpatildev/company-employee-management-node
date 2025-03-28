import { Router  } from "express";
import CompanyController from "./company.controller";
const companyRoutes= Router()

companyRoutes.post("/", CompanyController.registerCompany);
companyRoutes.get("/", CompanyController.getAllCompanies);
companyRoutes.put("/:id", CompanyController.updateCompany);
companyRoutes.patch("/:id", CompanyController.modifyCompany);
companyRoutes.get("/:id", CompanyController.getCompany); 
companyRoutes.delete("/:id", CompanyController.deleteCompany);


export default companyRoutes;