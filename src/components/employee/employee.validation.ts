import Joi from "joi";
import { Designation } from "../../common/enums";
import { IUser } from "./employee.model";

export const validateEmployee = (
  data: IUser,
  isPatch: boolean = false,
  isPut: boolean = false
) => {
  if (isPatch) {
    const patchSchema = Joi.object({
      companyId: Joi.string().empty("").required().messages({
        "string.base": "companyId must be a string",
        "string.empty": "companyId cannot be empty",
        "any.required": "companyId is required",
      }),
    });

    return patchSchema.validate(data, {
      abortEarly: false,
      errors: { wrap: { label: "" } },
    });
  } else {
    const fullSchema = Joi.object({
      firstName: Joi.string()
        .empty("")
        .when("$isPut", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "string.base": "firstName must be a string",
          "string.empty": "firstName cannot be empty",
          "any.required": "firstName is required",
        }),
      lastName: Joi.string()
        .empty("")
        .when("$isPut", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "string.base": "lastName must be a string",
          "string.empty": "lastName cannot be empty",
          "any.required": "lastName is required",
        }),
      email: Joi.string()
        .empty("")
        .when("$isPut", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .email()
        .lowercase()
        .messages({
          "string.base": "email must be a string",
          "string.email": "email must be a valid email",
          "string.empty": "email cannot be empty",
          "any.required": "email is required",
        }),
      password: Joi.string()
        .empty("")
        .when("$isPut", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .min(8)
        .messages({
          "string.base": "password must be a string",
          "string.empty": "password cannot be empty",
          "any.required": "password is required",
        }),
      companyId: Joi.string().empty("").messages({
        "string.base": "companyId must be a string",
        "string.empty": "companyId cannot be empty",
        "any.required": "companyId is required",
      }),
      designation: Joi.string()
        .empty("")
        .valid(...Object.values(Designation))
        .messages({
          "string.base": "designation must be a string",
          "string.empty": "designation cannot be empty",
          // "any.required": "designation is required",
          "any.only":
            "designation must be one of 'MANAGER', 'TEAM_LEADER', or 'DEVELOPER'",
        }),
      isVerified: Joi.boolean().messages({
        "boolean.base": "isVerified must be a boolean",
      }),
      reporters: Joi.array().items(Joi.string()).messages({
        "array.base": "reporters must be an array",
        // "any.required": "reporters is required",
      }),
      code: Joi.number().messages({
        "number.base": "code must be a number",
      }),
    });

    return fullSchema.validate(data, {
      abortEarly: false,
      context: { isPut },
      errors: { wrap: { label: "" } },
    });
  }
};

export const validateEmailPassword = (data: object) => {
  const patchSchema = Joi.object({
    email: Joi.string().empty("").email().lowercase().messages({
      "string.base": "email must be a string",
      "string.email": "email must be a valid email",
      "string.empty": "email cannot be empty",
      "any.required": "email is required",
    }),
    password: Joi.string().empty("").min(8).messages({
      "string.base": "password must be a string",
      "string.empty": "password cannot be empty",
      "any.required": "password is required",
    }),
  });

  return patchSchema.validate(data, {
    abortEarly: false,
    errors: { wrap: { label: "" } },
  });
};
