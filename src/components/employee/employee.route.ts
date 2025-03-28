import { Router  } from "express";
import EmployeeController from "./employee.controller";
const employeeRoutes= Router()


employeeRoutes.get("/", EmployeeController.getAllEmployees);
employeeRoutes.put("/:id", EmployeeController.updateEmployee);
employeeRoutes.patch("/:id", EmployeeController.modifyEmployee);
employeeRoutes.get("/:id", EmployeeController.getEmployee); 
employeeRoutes.delete("/:id", EmployeeController.deleteEmployee);


export default employeeRoutes;