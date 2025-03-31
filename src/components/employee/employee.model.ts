import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { Designation, Role } from "../../common/enums";

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
  reporters: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  code: {
    type: Number,
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER,
  },
});

const EmployeeModel: Model<IUser> = mongoose.model<IUser>(
  "Employee",
  employeeSchema
);

export default EmployeeModel;
