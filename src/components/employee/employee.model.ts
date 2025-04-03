import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { Designation, Role } from "../../common/enums";

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The employee's first name.
 *         lastName:
 *           type: string
 *           description: The employee's last name.
 *         email:
 *           type: string
 *           format: email
 *           description: The employee's email address.
 *         password:
 *           type: string
 *           description: The employee's password.
 *         isVerified:
 *           type: boolean
 *           description: Indicates whether the employee's email is verified.
 *         designation:
 *           type: string
 *           description: The designation of the employee.
 *           enum:
 *             - DEVELOPER
 *             - MANAGER
 *             - DESIGNER
 *           default: DEVELOPER
 *         companyId:
 *           type: string
 *           description: MongoDB ObjectId referencing the company.
 *         reporters:
 *           type: string
 *           description: MongoDB ObjectId referencing the reporter employee.
 *         code:
 *           type: number
 *           description: A unique employee code.
 *         role:
 *           type: string
 *           description: The role assigned to the employee.
 *           enum:
 *             - USER
 *             - ADMIN
 *           default: USER
 *         isDeleted:
 *           type: boolean
 *           description: Soft delete flag for the employee.
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - designation
 *         - role
 */

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  designation: Designation;
  companyId: Types.ObjectId;
  reporters: Types.ObjectId;
  code: number;
  role: Role;
  isDeleted: boolean;
}

const employeeSchema: Schema<IUser> = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
    enum: Object.values(Designation),
    default: Designation.DEVELOPER,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  isVerified: { type: Boolean, default: false },
  reporters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
  code: {
    type: Number,
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER,
  },
  isDeleted: { type: Boolean, default: false },
});

const EmployeeModel: Model<IUser> = mongoose.model<IUser>(
  "Employee",
  employeeSchema
);

export default EmployeeModel;
