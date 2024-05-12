import express, { Express, Application, urlencoded } from "express";
import { Server } from "http";
import { authConfig, serverConfig, dbConfig } from "./configs";
import cors from "cors";
import db from "./db";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import bodyParser from "body-parser";
import routers from "./routers";
import systemMiddleware from "./middleware/system.middleware";

class Main {
  public app: Application;
  protected port: number;
  private readonly corsOptions: cors.CorsOptions;
  protected server!: Server;

  constructor() {
    this.app = express();
    this.port = serverConfig.PORT;
    this.corsOptions = {
      origin:
        serverConfig.ALLOWED_ORIGINS != null
          ? serverConfig.ALLOWED_ORIGINS.split(",")
          : [],
    };

    this.initializeDatabase();
    this.initializeMiddlewareAndRoutes();

    const signals = ["SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM"];

    signals.forEach((signal) => {
      process.on(signal, async () => {
        await this.shutdown();
      });
    });
  }

  private async initializeDatabase() {
    db.connectDB();
  }

  private async initializeMiddlewareAndRoutes() {
    // This is to handle json and form value
    this.app.use(bodyParser.json());
    this.app.use(urlencoded({ extended: false }));

    // This is to handle the security of our application
    this.app.use(helmet());
    this.app.use(compression());

    // This is to control the cors: The first is to allow all origin for development and then specific origin for non development
    serverConfig.NODE_ENV === "development"
      ? this.app.use(cors())
      : this.app.use(cors(this.corsOptions));

    if (
      ["development", "staging", "production"].includes(serverConfig.NODE_ENV)
    ) {
      this.app.use(morgan("dev"));
    }

    this.app.use(routers);
    this.app.use(systemMiddleware.errorHandler());
  }

  public async start(): Promise<void> {
    this.server = this.app.listen(this.port, () => {
      serverConfig.DEBUG(
        `Server running on http://localHost:${this.port} in ${serverConfig.NODE_ENV} mode. press CTRL to stop`
      );
    });
  }

  private async shutdown() {
    console.log("node js is shutting down");
  }
}

const app = new Main();
app.start();
