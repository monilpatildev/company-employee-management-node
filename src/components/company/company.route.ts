import { Router } from "express";
import CompanyController from "./company.controller";
import AuthMiddleware from "../../middleware/authVerification";
import { Role } from "../../common/enums";

const companyRoutes = Router();

/**
 * @swagger
 * /api/companies:
 *   post:
 *     tags:
 *       - Company
 *     summary: Register a new company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *             example:
 *               name: "Acme Corp"
 *               email: "info@acmecorp.com"
 *               address:
 *                 line1: "123 Main St"
 *                 line2: "Suite 100"
 *                 city: "Metropolis"
 *                 state: "NY"
 *                 country: "USA"
 *                 zip: 123456
 *               contact: "9874561236"
 *               status: "ACTIVE"
 *     responses:
 *       201:
 *         description: Company created successfully
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
 *                   $ref: '#/components/schemas/Company'
 *             example:
 *               status: 201
 *               success: true
 *               message: "Company created successFully!"
 *               data:
 *                 name: "Kappa Industries"
 *                 email: "info@kappaindustrie.com"
 *                 address:
 *                   line1: "963 Kappa Drive"
 *                   city: "Houston"
 *                   state: "Texas"
 *                   country: "USA"
 *                   zip: "770160"
 *                 contact: "5235423536"
 *                 status: "ACTIVE"
 *                 isDeleted: false
 *                 _id: "67ece63be909aef1ae1359e5"
 *                 createdAt: "2025-04-02T07:24:43.747Z"
 *                 updatedAt: "2025-04-02T07:24:43.747Z"
 *       400:
 *         description: Bad Request - Company already exists
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
 *               message: "Company is already exist with this email or name!"
 *       401:
 *         description: Session expired
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
 *               message: "Session expired , login again"
 *       403:
 *         description: Access denied
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
 *               status: 403
 *               success: false
 *               message: "You cannot access this api"
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
 *
 */

companyRoutes.post(
  "/",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.registerCompany
);

/**
 * @swagger
 * /api/companies:
 *   get:
 *     tags:
 *       - Company
 *     summary: Get All Companies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Filter by company name
 *         required: false
 *         schema:
 *           type: string
 *       - name: email
 *         in: query
 *         description: Filter by company email
 *         required: false
 *         schema:
 *           type: string
 *           format: email
 *       - name: status
 *         in: query
 *         description: Filter by company status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully
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
 *                     $ref: '#/components/schemas/Company'
 *             example:
 *               status: 200
 *               success: true
 *               message: "Fetch 2 companies successfully!"
 *               data:
 *                 - name: "Kappa Industries"
 *                   email: "info@kappaindustrie.com"
 *                   address:
 *                     line1: "963 Kappa Drive"
 *                     city: "Houston"
 *                     state: "Texas"
 *                     country: "USA"
 *                     zip: "770160"
 *                   contact: "5235423536"
 *                   status: "ACTIVE"
 *                   isDeleted: false
 *                   _id: "67ece63be909aef1ae1359e5"
 *                 - name: "Acme Corp"
 *                   email: "info@acmecorp.com"
 *                   address:
 *                     line1: "123 Main St"
 *                     city: "Metropolis"
 *                     state: "NY"
 *                     country: "USA"
 *                     zip: "12345"
 *                   contact: "555-1234"
 *                   status: "INACTIVE"
 *                   isDeleted: false
 *                   _id: "67ece63be909aef1ae1359e6"
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
 *       403:
 *         description: Access denied
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
 *               status: 403
 *               success: false
 *               message: "You cannot access this api"
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

companyRoutes.get(
  "/",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.getAllCompanies
);

/**
 * @swagger
 * /api/companies/:id:
 *   get:
 *     tags:
 *       - Company
 *     summary: Get Company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: :id
 *         in: param
 *         description: Get company with id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully
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
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *             example:
 *               status: 200
 *               success: true
 *               message: "Fetch company successfully!"
 *               data:
 *                   name: "Kappa Industries"
 *                   email: "info@kappaindustrie.com"
 *                   address:
 *                     line1: "963 Kappa Drive"
 *                     city: "Houston"
 *                     state: "Texas"
 *                     country: "USA"
 *                     zip: "770160"
 *                   contact: "5235423536"
 *                   status: "ACTIVE"
 *                   isDeleted: false
 *                   _id: "67ece63be909aef1ae1359e5"
 *       400:
 *         description: Bad Request - Invalid company id
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
 *               message: "Invalid company id"
 *       401:
 *         description: Session expired
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
 *               message: "Session expired , login again"
 *       403:
 *         description: Access denied
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
 *               status: 403
 *               success: false
 *               message: "You cannot access this api"
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
 *
 */

companyRoutes.get(
  "/:id",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.getCompany
);


/**
 * @swagger
 * /api/companies/:id:
 *   put:
 *     tags:
 *       - Company
 *     summary: Update Company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: :id
 *         in: param
 *         description: Update company with id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *             example:
 *               name: "Acme Corp"
 *               email: "info@acmecorp.com"
 *               address:
 *                 line1: "123 Main St"
 *                 line2: "Suite 100"
 *                 city: "Metropolis"
 *                 state: "NY"
 *                 country: "USA"
 *                 zip: 123456
 *               contact: "9874561236"
 *               status: "ACTIVE"
 *     responses:
 *       200:
 *         description: Updated company retrieved successfully
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
 *                     $ref: '#/components/schemas/Company'
 *             example:
 *               status: 200
 *               success: true
 *               message: "Fetch company successfully!"
 *               data:
 *                   name: "Kappa Industries"
 *                   email: "info@kappaindustrie.com"
 *                   address:
 *                     line1: "963 Kappa Drive"
 *                     city: "Houston"
 *                     state: "Texas"
 *                     country: "USA"
 *                     zip: "770160"
 *                   contact: "5235423536"
 *                   status: "ACTIVE"
 *                   isDeleted: false
 *                   _id: "67ece63be909aef1ae1359e5"
 *       400:
 *         description: Bad Request - Invalid company id
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
 *               message: "Invalid company id"
 *       401:
 *         description: Session expired
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
 *               message: "Session expired , login again"
 *       403:
 *         description: Access denied
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
 *               status: 403
 *               success: false
 *               message: "You cannot access this api"
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
 *
 */

companyRoutes.put(
  "/:id",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.updateCompany
);
/**
 * @swagger
 * /api/companies/:id:
 *   patch:
 *     tags:
 *       - Company
 *     summary: Modify Company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: :id
 *         in: param
 *         description: Modify company with id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *             example:
 *               name: "Acme Corp"
 *               status: "ACTIVE"
 *     responses:
 *       200:
 *         description: Updated company retrieved successfully
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
 *                     $ref: '#/components/schemas/Company'
 *             example:
 *               status: 200
 *               success: true
 *               message: "Fetch company successfully!"
 *               data:
 *                   name: "Kappa Industries"
 *                   email: "info@kappaindustrie.com"
 *                   address:
 *                     line1: "963 Kappa Drive"
 *                     city: "Houston"
 *                     state: "Texas"
 *                     country: "USA"
 *                     zip: "770160"
 *                   contact: "5235423536"
 *                   status: "ACTIVE"
 *                   isDeleted: false
 *                   _id: "67ece63be909aef1ae1359e5"
 *       400:
 *         description: Bad Request - Invalid company id
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
 *               message: "Invalid company id"
 *       401:
 *         description: Session expired
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
 *               message: "Session expired , login again"
 *       403:
 *         description: Access denied
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
 *               status: 403
 *               success: false
 *               message: "You cannot access this api"
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
 *
 */
companyRoutes.patch(
  "/:id",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.modifyCompany
);

/**
 * @swagger
 * /api/companies/:id:
 *   delete:
 *     tags:
 *       - Company
 *     summary: Delete Company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: :id
 *         in: param
 *         description: Delete company with id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted
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
 *                     $ref: '#/components/schemas/Company'
 *             example:
 *               status: 200
 *               success: true
 *               message: "Company deleted successfully!"
 *       400:
 *         description: Bad Request - Invalid company id
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
 *               message: "Invalid company id"
 *       401:
 *         description: Session expired
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
 *               message: "Session expired , login again"
 *       403:
 *         description: Access denied
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
 *               status: 403
 *               success: false
 *               message: "You cannot access this api"
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
 *
 */
companyRoutes.delete(
  "/:id",
  AuthMiddleware.authenticate([Role.ADMIN]),
  CompanyController.deleteCompany
);

export default companyRoutes;
