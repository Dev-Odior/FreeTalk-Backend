import { config } from "dotenv";
config();

class DBconfig {
  public MONGO_URI = process.env.MONGO_URI;
}

export default new DBconfig();
