import mongoose from "mongoose";
import { Mongoose } from "mongoose";
import { dbConfig, serverConfig } from "@src/configs";

class Db {
  public DB: Mongoose;

  constructor() {
    this.DB = mongoose;
  }

  public async connectDB() {
    try {
      await mongoose.connect(`${dbConfig.MONGO_URI}`);
      serverConfig.DEBUG("Connected to MongoDB");
    } catch (error) {
      serverConfig.DEBUG("Error connecting to MongoDB:");
    }
  }

  public async closeDB() {
    try {
      await mongoose.disconnect();
      serverConfig.DEBUG("Disconnected from MongoDB");
    } catch (error) {
      serverConfig.DEBUG("Error disconnecting from MongoDB:");
    }
  }
}

export default new Db();
