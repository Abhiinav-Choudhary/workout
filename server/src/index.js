import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js"
import orderRoutes from "./routes/order.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import appointmentRoutes from "./routes/appointment.routes.js";
import trainingPlanRoutes from "./routes/training.routes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();
connectDB();

const app = express();


if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}


app.use(cors({
  origin: "https://workout-mauve.vercel.app", // your frontend
  // origin: "http://localhost:5173", // your frontend
  credentials: true
}));
// https://workout-mauve.vercel.app
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api" , generalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", orderRoutes);
app.use("/api/chat", chatRoutes);



app.use("/api/appointments", appointmentRoutes);

app.use("/api/training", trainingPlanRoutes);
app.use("/api/workout", workoutRoutes);


app.use("/api/admin", adminRoutes);


app.use((err, req, res, next) => {
  const redisErrorCodes = [
    "ECONNREFUSED",
    "ETIMEDOUT",
    "ECONNRESET",
    "NR_CLOSED",
  ];

  const isRedisUnavailable =
    redisErrorCodes.includes(err?.code) ||
    /redis.*(connection|connect|closed|timeout)|(?:connection|connect|closed|timeout).*redis/i
      .test(err?.message ?? "");

  if (isRedisUnavailable) {
    console.error("Rate-limit store unavailable:", err.message);

    return res.status(503).json({
      success: false,
      message: "Service temporarily unavailable. Please try again shortly.",
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
