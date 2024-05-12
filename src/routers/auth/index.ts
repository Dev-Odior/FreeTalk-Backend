import { Router, Response, Request, NextFunction } from "express";
import { serverConfig } from "@src/configs";
import { AuthController } from "@src/controller/auth_controller";
import systemMiddleware from "@src/middleware/system.middleware";
import authValidator from "@src/utils/validators/auth.validator";

class AuthRoutes extends AuthController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post(
      "/",
      systemMiddleware.validateRequestBody(authValidator.login),
      this.login
    );

    this.router.post(
      "/register",
      systemMiddleware.validateRequestBody(authValidator.signUp),
      this.signUp
    );

    this.router.post("/sign-out", this.logOut);
  }
}

export default new AuthRoutes().router;
