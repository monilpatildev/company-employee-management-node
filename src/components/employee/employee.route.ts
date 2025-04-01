import { Router } from "express";
import EmployeeController from "./employee.controller";
import AuthMiddleware from "../../middleware/authVerification";
import { Role } from "../../common/enums";

const employeeRoutes = Router();

employeeRoutes.get(
  "/",
  AuthMiddleware.authenticate([Role.USER, Role.ADMIN]),
  EmployeeController.getAllEmployees
);
employeeRoutes.put(
  "/:id",
  AuthMiddleware.authenticate([Role.USER, Role.ADMIN]),
  EmployeeController.updateEmployee
);
employeeRoutes.patch(
  "/:id",
  AuthMiddleware.authenticate([Role.USER, Role.ADMIN]),
  EmployeeController.modifyEmployee
);
employeeRoutes.get(
  "/:id",
  AuthMiddleware.authenticate([Role.USER, Role.ADMIN]),
  EmployeeController.getEmployee
);
employeeRoutes.delete(
  "/:id",
  AuthMiddleware.authenticate([Role.USER, Role.ADMIN]),
  EmployeeController.deleteEmployee
);

export default employeeRoutes;
