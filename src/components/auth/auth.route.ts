import { Router } from "express";
import authController from "./auth.controller";
const authRoutes = Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new employee
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
 *               password: "your_password"
 *     responses:
 *       201:
 *         description: Employee registered successfully
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
 *                   $ref: '#/components/schemas/Employee'
 *             example:
 *               status: 201
 *               success: true
 *               message: "Employee registered successfully!"
 *               data:
 *                 _id: "67ece63be909aef1ae1359e5"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@example.com"
 *                 designation: "DEVELOPER"
 *                 isVerified: true
 *       400:
 *         description: Bad Request - Employee already exists
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
 *               message: "Employee already exists with this email!"
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

authRoutes.post("/register", authController.registerEmployee);

/**
 * @swagger
 * /api/account-verify/:token:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Verify employee
 *     parameters:
 *       - name: :token
 *         in: param
 *         description: Verify employee with token
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
 *             example:
 *               status: 200
 *               success: true
 *               message: "Employee verify successfully!"
 *       400:
 *         description: Bad Request - Invalid token
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
 *               message: "Invalid token"
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

authRoutes.get(
  "/account-verify/:token",
  authController.verifyEmployeeWithToken
);


/**
 * @swagger
 * /api/authenticate:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authenticate user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *             example:
 *               email: "john.doe@example.com"
 *               password: "your_password"
 *     responses:
 *       200:
 *         description: Authenticated successfully
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
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *             example:
 *               status: 200
 *               success: true
 *               message: "Authenticated successfully!"
 *               data: 
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVJ9.  eyJfaWQiOiI2N2ViZGRlNjkxZDU4NzIyOGVlYTBlOTgiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc0MzU4OTY2MiwiZXhwIjoxNzQzNTkxNDYyfQ.JRLWQB1YUpO4xQPhOBiiEl4hWg_UK1dCPi46_kZtnzw"
 *                 refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVJ9.eyJfaWQiOiI2N2ViZGRlNjkxZDU4NzIyOGVlYTBlOTgiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc0MzU4OTY2MiwiZXhwIjoxNzQzNjc2MDYyfQ.RmcvUwyeUV22lqK55HfpOuVJV9HNBS39EAZnRTRM1C4"
 *       400:
 *         description: Bad Request - Authentication failed
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
 *               message: "Email or password invalid."
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

authRoutes.post("/authenticate", authController.authenticateEmployee);

/**
 * @swagger
 * /api/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Generate new access and refresh tokens using the provided refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token provided by the user.
 *             example:
 *               refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXJ9.eyJfaWQiOiI2N2ViZGRlNjkxZDU4NzIyOGVlYTBlOTgiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc0MzU4OTY2MiwiZXhwIjoxNzQzNTkxNDYyfQ.JRLWQB1YUpO4xQPhOBiiEl4hWg_UK1dCPi46_kZtnzw"
 *     responses:
 *       201:
 *         description: Tokens generated successfully
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
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *             example:
 *               status: 201
 *               success: true
 *               message: "Tokens generated successfully!"
 *               data:
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXJ9.eyJfaWQiOiI2N2ViZGRlNjkxZDU4NzIyOGVlYTBlOTgiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc0MzU4OTY2MiwiZXhwIjoxNzQzNTkxNDYyfQ.JRLWQB1YUpO4xQPhOBiiEl4hWg_UK1dCPi46_kZtnzw"
 *                 refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXJ9.eyJfaWQiOiI2N2ViZGRlNjkxZDU4NzIyOGVlYTBlOTgiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc0MzU4OTY2MiwiZXhwIjoxNzQzNjc2MDYyfQ.RmcvUwyeUV22lqK55HfpOuVJV9HNBS39EAZnRTRM1C4"
 *       400:
 *         description: Bad Request - Invalid refresh token provided
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
 *               message: "Invalid refresh token provided!"
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

authRoutes.post("/refresh-token", authController.generateRefreshToken);

export default authRoutes;
