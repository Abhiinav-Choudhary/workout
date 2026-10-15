
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../config/redis.js";

const createRedisStore = (prefix) =>
  new RedisStore({
    prefix,
    sendCommand: (command, ...args) =>
      redis.call(command, ...args),
  });

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,

  store: createRedisStore("rl:general:"),
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,

  store: createRedisStore("rl:login:"),
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});
