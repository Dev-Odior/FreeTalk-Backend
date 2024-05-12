import Joi from "joi";
import { ValidationOptions } from "joi";

export class BaseValidator {
  private validationOption: ValidationOptions = {
    errors: {
      wrap: {
        label: "",
      },
    },
    abortEarly: false,
  };

  protected validate(schema: Joi.AnySchema, payload: unknown) {
    return schema.validate(payload, this.validationOption);
  }
}
