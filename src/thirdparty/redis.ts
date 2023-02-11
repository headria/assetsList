import IORedis, { Redis } from "ioredis";

let redis: Redis = new IORedis({
  maxRetriesPerRequest: 4,
});

export const disconnectRedis = async () => {
  await redis.quit();
};

export default redis;
