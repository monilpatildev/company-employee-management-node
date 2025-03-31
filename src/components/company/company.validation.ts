import Joi from "joi";
import { ICompany } from "./company.model";
import { CompanyStatus } from "../../common/enums";

const validateCompany = (data: ICompany, isPatch: boolean = false) => {
  const validateSchema = Joi.object({
    name: Joi.string()
      .empty("")
      .when("$isPatch", {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        "string.base": "name must be a string",
        "string.empty": "name cannot be empty",
        "any.required": "name is required",
      }),

    email: Joi.string()
      .email()
      .lowercase()
      .empty("")
      .when("$isPatch", {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        "string.base": "email must be a string",
        "string.email": "email must be a valid email",
        "string.empty": "email cannot be empty",
        "any.required": "email is required",
      }),

    address: Joi.object({
      line1: Joi.string()
        .empty("")
        .when("$isPatch", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "string.base": "line1 must be a string",
          "string.empty": "line1 cannot be empty",
          "any.required": "line1 is required",
        }),

      line2: Joi.string().empty("").optional().messages({
        "string.base": "line2 must be a string",
        "string.empty": "line2 cannot be empty",
      }),

      city: Joi.string()
        .empty("")
        .when("$isPatch", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "string.base": "city must be a string",
          "string.empty": "city cannot be empty",
          "any.required": "city is required",
        }),

      state: Joi.string()
        .empty("")
        .when("$isPatch", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "string.base": "state must be a string",
          "string.empty": "state cannot be empty",
          "any.required": "state is required",
        }),

      country: Joi.string()
        .empty("")
        .when("$isPatch", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "string.base": "country must be a string",
          "string.empty": "country cannot be empty",
          "any.required": "country is required",
        }),

      zip: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .empty("")
        .when("$isPatch", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "string.base": "zip must be a string of numbers",
          "string.length": "zip must be exactly 6 digits",
          "string.pattern.base": "zip must contain only numbers",
          "string.empty": "zip cannot be empty",
          "any.required": "zip is required",
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
      .empty("")
      .when("$isPatch", {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        "string.base": "contact must be a string of numbers",
        "string.length": "contact must be exactly 10 digits",
        "string.pattern.base": "contact must contain only numbers",
        "string.empty": "contact cannot be empty",
        "any.required": "contact is required",
      }),

    status: Joi.string()
      .empty("")
      .valid(CompanyStatus.ACTIVE, CompanyStatus.INACTIVE)
      .when("$isPatch", {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        "string.base": "status must be a string",
        "string.empty": "status cannot be empty",
        "any.required": "status is required",
        "any.only": "status must be either ACTIVE or INACTIVE",
      }),
  });

  return validateSchema.validate(data, {
    abortEarly: false,
    context: { isPatch },
    errors: { wrap: { label: "" } },
  });
};

export default validateCompany;
