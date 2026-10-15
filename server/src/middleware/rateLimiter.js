
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
    passOnStoreError: true,
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
   passOnStoreError: false,
  store: createRedisStore("rl:login:"),
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});


export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: false,

  store: createRedisStore("rl:forgot-password:"),

  message: {
    success: false,
    message: "Too many password reset requests. Please try again later.",
  },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: false,

  store: createRedisStore("rl:reset-password:"),

  message: {
    success: false,
    message: "Too many reset attempts. Please try again later.",
  },
});

