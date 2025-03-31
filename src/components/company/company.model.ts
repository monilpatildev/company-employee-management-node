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
  contact: string;
  status: CompanyStatus;
}

const companySchema: Schema<ICompany> = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zip: { type: String, required: true },
    },
    contact: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(CompanyStatus),
      default: CompanyStatus.INACTIVE,
    },
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
