import { config } from "dotenv";

config();

class AuthConfig {
  public ACCESS_TOKEN_EXPIRES_IN = 10;
  public BCRYPT_SALT_ROUND = 10;
}

export default new AuthConfig();
