import IORedis, { Redis } from "ioredis";

let redis: Redis = new IORedis({
  maxRetriesPerRequest: 4,
});

export default redis;
