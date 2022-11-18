import mongoose from "mongoose";
import dotenv from "dotenv";
import { LoggerService } from "../logger";

dotenv.config();

export let db: any = {};

var mongoConnectionUri: any = {
  server: "cluster0.qg3ftga.mongodb.net",
  port: "27017",
  username: "Planetlabs",
  password: "KoZ0huvNY5ZYg48V",
  database: "walletmemes",
  shard: true,
};

export var CONNECTION_URI = "";

if (!mongoConnectionUri.username) {
  CONNECTION_URI =
    "mongodb://" +
    mongoConnectionUri.server +
    ":" +
    mongoConnectionUri.port +
    "/" +
    mongoConnectionUri.database;
  if (mongoConnectionUri.shard === true)
    CONNECTION_URI =
      "mongodb+srv://" +
      mongoConnectionUri.server +
      "/" +
      mongoConnectionUri.database;
} else {
  if (mongoConnectionUri.shard === true) {
    CONNECTION_URI =
      "mongodb+srv://" +
      mongoConnectionUri.username +
      ":" +
      mongoConnectionUri.password +
      "@" +
      mongoConnectionUri.server +
      "/" +
      mongoConnectionUri.database +
      "?retryWrites=true&w=majority";
  } else {
    CONNECTION_URI =
      "mongodb://" +
      mongoConnectionUri.username +
      ":" +
      mongoConnectionUri.password +
      "@" +
      mongoConnectionUri.server +
      ":" +
      mongoConnectionUri.port +
      "/" +
      mongoConnectionUri.database;
  }
}
if (process.env.TD_MONGODB_URI) CONNECTION_URI = process.env.TD_MONGODB_URI;

var options: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const init = async (callback?: any, connectionString?: string, opts?: any) => {
  if (connectionString) CONNECTION_URI = connectionString;
  if (opts) options = opts;
  options.dbName = mongoConnectionUri.database;
  if (db.connection) {
    return callback(null, db);
  }

  mongoose.Promise = global.Promise;
  try {
    await mongoose.connect(CONNECTION_URI, options);
    db.connection = mongoose.connection;
    await mongoose.connection.db.admin().command({
      buildInfo: 1,
    });

    LoggerService.info("database is connected. ");
  } catch (e: any) {
    LoggerService.error("Oh no, something went wrong with DB! - " + e.message);
    db.connection = null;

    return callback(e, null);
  }
};

export default init;
