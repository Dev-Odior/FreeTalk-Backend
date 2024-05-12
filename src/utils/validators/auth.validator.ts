import Joi, { ValidationResult } from "joi";
import { Request } from "express";

import { serverConfig } from "@src/configs";
import { BaseValidator } from ".";


// i was having troubles with the this use consistent arrow thingy

class AuthValidator extends BaseValidator {
  public signUp = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      name: Joi.string().required().label("Name"),
      email: Joi.string().required().email().label("Email"),
      password: Joi.string().required().label("Password"),
    });

    return this.validate(schema, req.body);
  };

  public login = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().required().label("Password"),
    });

    return this.validate(schema, req.body);
  };
}

const authValidator = new AuthValidator();
export default authValidator;
