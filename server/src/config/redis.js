import "dotenv/config"
import Redis from "ioredis";

// const redis = new Redis("redis://127.0.0.1:6379");


const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is missing");
}

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    return Math.min(times * 500, 5000);
  },
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

export default redis;
