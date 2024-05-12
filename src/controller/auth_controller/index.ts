import { Request, Response, NextFunction } from "express";
import { serverConfig } from "@src/configs";
import authService from "@src/services/auth/auth.service";

export class AuthController {
  protected async signUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const user = await authService.register(name, email, password);
      const data = await authService.removeUserPassword(user);
      const token = authService.generateAccessToken(data);

      res.status(200).json({
        msg: "User Registration successful",
        data: {
          user: user,
          data: data,
          accessToken: token,
        },
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in Authentication controller -- Signup ${error}`
      );
      next(error);
    }
  }

  protected async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const info = await authService.getUserInformation(email, password);
      const data = authService.login(info);

      res.status(200).json({
        msg: "Log in Successful",
        user: data,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in Authentication controller -- login ${error}`
      );
      next(error);
    }
  }

  protected async logOut(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.status(200).json({
        msg: "Log out Successfully",
        data: {},
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in Authentication controller -- logout ${error}`
      );
      next(error);
    }
  }
}
