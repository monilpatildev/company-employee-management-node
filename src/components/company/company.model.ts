import mongoose, { Document, Model, Schema } from "mongoose";
import { CompanyStatus } from "../../common/enums";

export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  zip: number;
}

export interface ICompany extends Document {
  name: string;
  email: string;
  address: Address;
  contact: number;
  status: CompanyStatus;
}

const companySchema: Schema<ICompany> = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    email: { type: String, unique: true, lowercase: true },
    address: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zip: { type: Number },
    },
    contact: { type: Number },
    status: { type: String, enum: Object.values(CompanyStatus) },
  },
  {
    timestamps: true,
  }
);

const CompanyModel: Model<ICompany> = mongoose.model<ICompany>(
  "Company",
  companySchema
);

export default CompanyModel;
