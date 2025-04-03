import mongoose, { Document, Model, Schema } from "mongoose";
import { CompanyStatus } from "../../common/enums";

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         line1:
 *           type: string
 *         line2:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         country:
 *           type: string
 *         zip:
 *           type: number
 *       required:
 *         - line1
 *         - city
 *         - state
 *         - country
 *         - zip
 *
 *     Company:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         contact:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *           default: ACTIVE
 *         isDeleted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - email
 *         - address
 *         - contact
 *         - status
 */

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
  isDeleted: boolean;
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
      default: CompanyStatus.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
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
