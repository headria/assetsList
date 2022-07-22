const mongoose = require("mongoose");
import { LoggerService } from "../logger";
require("dotenv").config();

let db: any = {};
var mongoConnectionUri: any = {
  server: "cluster0.vnbkz.mongodb.net",
  port: "27017",
  username: "arab2wallet",
  password: "Ej6N8spsk4PngIj4",
  database: "arabwallet",
  shard: true,
};
const uri =
  "mongodb+srv://admin:<password>@cluster0-fbhza.mongodb.net/test?retryWrites=true&w=majority";

var CONNECTION_URI = "";
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
};

export const init = (callback: any, connectionString: string, opts: any) => {
  if (connectionString) CONNECTION_URI = connectionString;
  if (opts) options = opts;
  options.dbName = mongoConnectionUri.database;

  if (db.connection) {
    return callback(null, db);
  }

  options.useUnifiedTopology = true;
  mongoose.Promise = global.Promise;
  mongoose
    .connect(CONNECTION_URI, options)
    .then(function () {
      db.connection = mongoose.connection;
      mongoose.connection.db.admin().command(
        {
          buildInfo: 1,
        },
        function (err: any, info: any) {
          if (err) LoggerService.warn(err.message);
          LoggerService.info(
            "database is connected. version is : " + info.version
          );

          db.version = info.version;
          return callback(null, db);
        }
      );
    })
    .catch(function (e: any) {
      LoggerService.error(
        "Oh no, something went wrong with DB! - " + e.message
      );
      db.connection = null;

      return callback(e, null);
    });
};

module.exports.db = db;
module.exports.connectionuri = CONNECTION_URI;
