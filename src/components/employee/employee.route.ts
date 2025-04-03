import { Router } from "express";
import EmployeeController from "./employee.controller";
import AuthMiddleware from "../../middleware/authVerification";
import { Role } from "../../common/enums";

const employeeRoutes = Router();


/**
 * @swagger
 * /api/employee:
 *   get:
 *     tags:
 *       - Employee
 *     summary: Get All Employee
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Filter by employee name
 *         required: false
 *         schema:
 *           type: string
 *       - name: email
 *         in: query
 *         description: Filter by employee email
 *         required: false
 *         schema:
 *           type: string
 *           format: email
 *       - name: company
 *         in: query
 *         description: Filter by employee company
 *         required: false
 *         schema:
 *           type: string
 *       - name: designation
 *         in: query
 *         description: Filter by employee designation
 *         required: false
 *         schema:
 *           type: string
 *           enum: [MANAGER, TEAM_LEADER,DEVELOPER]
 *     responses:
 *       200:
 *         description: List of employees retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                   properties:
 *                     _id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     designation:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     company:
 *                       type: string
 *             example:
 *               status: 200
 *               success: true
 *               message: "Fetch 2 employees successfully!"
 *               data:
  *                - _id: "67e66ecfafc62907ab5a2c7c"
  *                  firstName: "test"
  *                  lastName: "lastName"
  *                  email: "monilp685@gmail.com"
  *                  designation: "DEVELOPER"
  *                  isVerified: true
  *                  company : "Beta Innovations"
  *                - _id: "67e66ecfafc62907ab5a2c7c"
  *                  firstName: "test"
  *                  lastName: "lastName"
  *                  email: "monilp685@gmail.com"
  *                  designation: "DEVELOPER"
  *                  isVerified: true
  *                  company: "Beta Innovations"
 *       401:
 *         description: Bad Request - Invalid session or authentication issue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 400
 *               success: false
 *               message: "Session is expired, authenticate again"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               success: false
 *               message: "Internal server error"
 */

employeeRoutes.get(
  "/",
  AuthMiddleware.authenticate([Role.USER, Role.ADMIN]),
  EmployeeController.getAllEmployees
);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     tags:
 *       - Employee
 *     summary: Update employee
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Id of the employee to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *             example:
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     designation:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *             example:
 *               status: 200
 *               success: true
 *               message: "Fetch Employee successFully!"
 *               data:
 *                 _id: "67e68afb450a34622b877a72"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@gmail.com"
 *                 designation: "DEVELOPER"
 *                 isVerified: true
 *                 company:
 *                   _id: "67e5429e2d70f8f7cc01a96b"
 *                   name: "Tech Innovators"
 *                   email: "info@techinnovators.com"
 *                   address:
 *                     line1: "123 Silicon Street, San Jose"
 *                     city: "San Jose"
 *                     state: "California"
 *                     country: "USA"
 *                     zip: "951122"
 *                   contact: "9543218760"
 *                   status: "ACTIVE"
 *                   createdAt: "2025-03-27T12:20:46.465Z"
 *                   updatedAt: "2025-04-01T11:42:26.843Z"
 *       400:
 *         description: Bad Request - Invalid employee id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 400
 *               success: false
 *               message: "Invalid employee id"
 *       401:
 *         description: Session expired - login again
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 401
 *               success: false
 *               message: "Session expired, login again"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               success: false
 *               message: "Internal server error"
 */


employeeRoutes.put(
  "/:id",
  AuthMiddleware.authenticate([Role.USER, Role.ADMIN]),
  EmployeeController.updateEmployee
);


/**
 * @swagger
 * /api/employees/{id}:
 *   patch:
 *     tags:
 *       - Employee
 *     summary: Update employee
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the employee to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: The company id.
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     designation:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *             example:
 *               status: 200
 *               success: true
 *               message: "Fetch Employee successFully!"
 *               data:
 *                 _id: "67e68afb450a34622b877a72"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@gmail.com"
 *                 designation: "DEVELOPER"
 *                 isVerified: true
 *                 companyId: "67e5429e2d70f8f7cc01a96b"
 *       400:
 *         description: Bad Request - Invalid employee id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 400
 *               success: false
 *               message: "Invalid employee id"
 *       401:
 *         description: Session expired - login again
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 401
 *               success: false
 *               message: "Session expired, login again"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               success: false
 *               message: "Internal server error"
 */


employeeRoutes.patch(
  "/:id",
  AuthMiddleware.authenticate([Role.USER, Role.ADMIN]),
  EmployeeController.modifyEmployee
);

/**
 * @swagger
 * /api/employees:
 *   get:
 *     tags:
 *       - Employee
 *     summary: Get employee by id
 *     description: Retrieve an employee by providing the companyId in the request body.
 *     parameters:
 *       - name: :id
 *         in: param
 *         description: Get company with id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     designation:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *             example:
 *               status: 200
 *               success: true
 *               message: "Fetch employee successfully!"
 *               data:
 *                 _id: "67e68afb450a34622b877a72"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@gmail.com"
 *                 designation: "DEVELOPER"
 *                 isVerified: true
 *                 company:
 *                   _id: "67e5429e2d70f8f7cc01a96b"
 *                   name: "Tech Innovators"
 *                   email: "info@techinnovators.com"
 *                   address:
 *                     line1: "123 Silicon Street, San Jose"
 *                     city: "San Jose"
 *                     state: "California"
 *                     country: "USA"
 *                     zip: "951122"
 *                   contact: "9543218760"
 *                   status: "ACTIVE"
 *                   createdAt: "2025-03-27T12:20:46.465Z"
 *                   updatedAt: "2025-04-01T11:42:26.843Z"
 *       400:
 *         description: Bad Request - Invalid employee id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 400
 *               success: false
 *               message: "Invalid employee id"
 *       401:
 *         description: Session expired - login again
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 401
 *               success: false
 *               message: "Session expired, login again"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               success: false
 *               message: "Internal server error"
 */

employeeRoutes.get(
  "/:id",
  AuthMiddleware.authenticate([Role.USER, Role.ADMIN]),
  EmployeeController.getEmployee
);


/**
 * @swagger
 * /api/employees:
 *   delete:
 *     tags:
 *       - Employee
 *     summary: Delete employee by id
 *     description: Delete employee by id
 *     parameters:
 *       - name: :id
 *         in: param
 *         description: delete company with id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 200
 *               success: true
 *               message: "Employee deleted successfully!"
 *       400:
 *         description: Bad Request - Invalid employee id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 400
 *               success: false
 *               message: "Invalid employee id"
 *       401:
 *         description: Session expired - login again
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 401
 *               success: false
 *               message: "Session expired, login again"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               success: false
 *               message: "Internal server error"
 */

employeeRoutes.delete(
  "/:id",
  AuthMiddleware.authenticate([Role.USER, Role.ADMIN]),
  EmployeeController.deleteEmployee
);

export default employeeRoutes;
