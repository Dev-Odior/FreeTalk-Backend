import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { serverConfig } from "@src/configs";
import Joi from "joi";
import { SystemError } from "@src/errors";
import { RequestValidator } from "@src/interfaces/functions.interface";

class SystemMiddleware {
  public errorHandler(): ErrorRequestHandler {
    return (error, req: Request, res: Response, next: NextFunction) => {
      const isProduction = serverConfig.NODE_ENV === "production";

      const errorCode =
        error.code != null &&
        Number(error.code) >= 100 &&
        Number(error.code) <= 599
          ? error.code
          : 500;

      let errorMessage: SystemError | object = {};

      if (res.headersSent) {
        next(error);
      }

      if (!isProduction) {
        serverConfig.DEBUG(error.stack);
        errorMessage = error;
      }

      if (serverConfig.NODE_ENV === "development") console.log(error);

      if (error instanceof Joi.ValidationError) {
        return res.status(400).json({
          message: "Validation error",
          error: error.details.map((detail) => detail.message),
        });
      }

      if (errorCode === 500 && isProduction) {
        res.status(500).json({
          message: "An unexpected error occurred. Please try again later.",
        });
      }

      res.status(errorCode).json({
        message: error.message,
        error: {
          ...(error.errors && { error: error.errors }),
          ...(!isProduction && { trace: errorMessage }),
        },
      });
    };
  }

  public formatRequestQuery(req: Request, _res: Response, next: NextFunction) {
    try {
      const {
        query: { limit, offset, search },
      } = req;

      req.queryOpts = {
        limit: Number(limit) ? Number(limit) : 10,
        offset: Number(offset) ? Number(offset) : 0,
        search: search ? (search as string) : undefined,
      };

      return next();
    } catch (error) {
      serverConfig.DEBUG(
        `Error in system middleware format request query: ${error}`
      );
      return next(error);
    }
  }

  public validateRequestBody(validator: RequestValidator) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = validator(req);
      if (error) throw error;
      req.body = value;
      next();
    };
  }
}

export default new SystemMiddleware();
