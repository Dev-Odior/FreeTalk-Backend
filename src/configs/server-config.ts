import { config } from "dotenv";
import debug from "debug";

config();

class ServerConfig {
  public PORT = Number(process.env.PORT);
  public ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
  public NODE_ENV = process.env.NODE_ENV || "development";

  public DEBUG =
    process.env.NODE_ENV === "development" ? debug("dev") : console.log;
}

export default new ServerConfig();
