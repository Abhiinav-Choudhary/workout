
import redis from "../config/redis.js";

export const cacheResponse = ({
  ttlSeconds = 120,
  keyPrefix = "cache",
} = {}) => {
  return async (req, res, next) => {
    // Cache only GET requests
    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = `${keyPrefix}:${req.originalUrl}`;

    try {
      const cachedData = await redis.get(cacheKey);

      if (cachedData !== null) {
        res.set("X-Cache", "HIT");
        return res.status(200).json(JSON.parse(cachedData));
      }
    } catch (error) {
      // Redis failure must not prevent the database request
      console.error("Cache read failed:", error.message);
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
      // Cache successful responses only
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redis
          .set(
            cacheKey,
            JSON.stringify(body),
            "EX",
            ttlSeconds
          )
          .catch((error) => {
            console.error("Cache write failed:", error.message);
          });
      }

      res.set("X-Cache", "MISS");
      return originalJson(body);
    };

    next();
  };
};
