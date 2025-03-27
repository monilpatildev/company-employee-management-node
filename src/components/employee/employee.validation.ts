import Joi from "joi";
import { Designation } from "../../common/enums";
import { IUser } from "./employee.model";


export const validateEmployee = (data: IUser) => {
  const validateSchema = Joi.object({
    firstName: Joi.string().required().messages({
      "string.base": "firstName must be a string",
      "any.required": "firstName is required",
    }),
    lastName: Joi.string().required().messages({
      "string.base": "lastName must be a string",
      "any.required": "lastName is required",
    }),
    email: Joi.string().required().email().lowercase().messages({
      "string.base": "email must be a string",
      "string.email": "email must be a valid email",
      "any.required": "email is required",
    }),
    password: Joi.string().required().messages({
      "string.base": "password must be a string",
      "any.required": "password is required",
    }),

    companyId: Joi.string().messages({
      "string.base": "companyId must be a string",
      "any.required": "companyId is required",
    }),
    designation: Joi.string()
      .valid(...Object.values(Designation))
      .messages({
        "string.base": "designation must be a string",
        "any.required": "designation is required",
        "any.only":
          "designation must be one of 'MANAGER', 'TEAM_LEADER', or 'DEVELOPER'",
      }),
    isVerified: Joi.boolean().messages({
      "boolean.base": "isVerified must be a boolean",
    }),
    reporters: Joi.array().items(Joi.string()).messages({
      "array.base": "reporters must be an array",
      "any.required": "reporters is required",
    }),
    code: Joi.number().messages({
      "number.base": "code must be a number",
      "any.required": "code is required",
    }),
  });

  return validateSchema.validate(data, { abortEarly: false });
};

export default validateEmployee;
