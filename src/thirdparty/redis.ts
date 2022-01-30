import IORedis, { Redis } from "ioredis";
import { LoggerService } from "../logger";

let redis: Redis = new IORedis({
  maxRetriesPerRequest: 4,
});

export default redis;
