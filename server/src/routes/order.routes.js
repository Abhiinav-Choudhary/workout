import express from "express";
import {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";

import { protect,admin } from "../middleware/auth.middleware.js";
// import { adminOnly } from "../middleware/admin.js";

const router = express.Router();

// USER
router.post("/create-order", protect, createOrder);
router.post("/verify",protect,  verifyPayment);
router.get("/my-orders", protect, getMyOrders);

// ADMIN
router.get("/admin/all", protect, admin, getAllOrders);
router.put("/admin/:id", protect, admin, updateOrderStatus);

export default router;
