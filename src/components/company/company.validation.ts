import Joi from "joi";
import { ICompany } from "./company.model";
import { CompanyStatus } from "../../common/enums";

const validateCompany = (data: ICompany, isPatch: boolean = false) => {
  const validateSchema = Joi.object({
    name: Joi.string()
      .when("$isPatch", {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        "string.base": "name must be a string",
        "any.required": "name is required",
      }),

    email: Joi.string()
      .email()
      .lowercase()
      .when("$isPatch", {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        "string.base": "email must be a string",
        "string.email": "email must be a valid email",
        "any.required": "email is required",
      }),

    address: Joi.object({
      line1: Joi.string()
        .when("$isPatch", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "string.base": "line1 must be a string",
          "any.required": "line1 is required",
        }),

      line2: Joi.string().optional().messages({
        "string.base": "line2 must be a string",
      }),

      city: Joi.string()
        .when("$isPatch", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "string.base": "city must be a string",
          "any.required": "city is required",
        }),

      state: Joi.string()
        .when("$isPatch", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "string.base": "state must be a string",
          "any.required": "state is required",
        }),

      country: Joi.string()
        .when("$isPatch", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "string.base": "country must be a string",
          "any.required": "country is required",
        }),

      zip: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .optional()
        .messages({
          "number.base": "zip must be a number",
        }),
    })
      .when("$isPatch", {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        "any.required": "Address is required",
      }),

    contact: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .when("$isPatch", {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        "number.base": "contact must be a number",
        "any.required": "contact is required",
      }),

    status: Joi.string()
      .valid(CompanyStatus.ACTIVE, CompanyStatus.INACTIVE)
      .when("$isPatch", {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        "string.base": "status must be a string",
        "any.required": "status is required",
        "any.only": "status must be either ACTIVE or INACTIVE",
      }),
  });

  return validateSchema.validate(data, {
    abortEarly: false,
    context: { isPatch },
  });
};

export default validateCompany;
