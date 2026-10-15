
import Redis from "ioredis";

const redis = new Redis("redis://127.0.0.1:6379");

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

export default redis;
