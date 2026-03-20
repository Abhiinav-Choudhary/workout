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


dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "https://workout-mauve.vercel.app", // your frontend
  credentials: true
}));
// https://workout-mauve.vercel.app
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", orderRoutes);
app.use("/api/chat", chatRoutes);



app.use("/api/appointments", appointmentRoutes);

app.use("/api/training", trainingPlanRoutes);
app.use("/api/workout", workoutRoutes);


app.use("/api/admin", adminRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
