import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import { LoggerService } from "./logger";
import routes from "./routes";
const mongoose = require("./database");

const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
require("dotenv").config();

//mongoose
{
  mongoose.init(function (err: any, db: any) {
    if (err) {
      LoggerService.error(err.message);
    }
  });
}

async function run() {
  const app = express();
  const PORT = process.env.PORT || 5005;

  // standard express middlewares
  app.use(helmet());
  app.use(compression());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use("/api/v1/", routes);

  // start HTTP server
  const httpServer = createServer(app);

  httpServer.listen(PORT, () => {
    LoggerService.info(`🚀 Server ready at http://localhost:${PORT}`);
  });
}

process.on("unhandledRejection", (error) => {
  // Will print "unhandledRejection err is not defined"
  LoggerService.error("unhandledRejection", error);
});

run().then(() => LoggerService.info(`Server Successfully Started`));
