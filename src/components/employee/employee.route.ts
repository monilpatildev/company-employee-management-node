import { Router } from "express";
import EmployeeController from "./employee.controller";
import AuthMiddleware from "../../middleware/authVerification";
import { Role } from "../../common/enums";

const employeeRoutes = Router();

employeeRoutes.get(
  "/",
  AuthMiddleware.verifyToken([Role.USER, Role.ADMIN]),
  EmployeeController.getAllEmployees
);
employeeRoutes.put(
  "/:id",
  AuthMiddleware.verifyToken([Role.USER, Role.ADMIN]),
  EmployeeController.updateEmployee
);
employeeRoutes.patch(
  "/:id",
  AuthMiddleware.verifyToken([Role.USER, Role.ADMIN]),
  EmployeeController.modifyEmployee
);
employeeRoutes.get(
  "/:id",
  AuthMiddleware.verifyToken([Role.USER, Role.ADMIN]),
  EmployeeController.getEmployee
);
employeeRoutes.delete(
  "/:id",
  AuthMiddleware.verifyToken([Role.USER, Role.ADMIN]),
  EmployeeController.deleteEmployee
);

export default employeeRoutes;
