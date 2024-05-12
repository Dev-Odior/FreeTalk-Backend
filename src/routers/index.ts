import { Router, Response, Request } from "express";
import { serverConfig } from "@src/configs";
import { NotFoundError } from "@src/errors";
import authRouter from "./auth";
import systemMiddleware from "@src/middleware/system.middleware";

class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", (req: Request, res: Response) => {
      res.status(200).json({
        message: "Welcome to freeTalk backend",
        data: {
          environment: serverConfig.NODE_ENV,
          version: "1.0.0",
        },
      });
    });

    // This would check if there is any query params and then work it out -- for the pagination
    this.router.use(systemMiddleware.formatRequestQuery);

    // This would handle all the routes and do the needful
    this.router.use("/auth", authRouter);

    this.router.all("*", () => {
      throw new NotFoundError("There was no routes found");
    });
  }
}

export default new Routes().router;
