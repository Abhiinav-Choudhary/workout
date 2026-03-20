// controllers/order.controller.js
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import crypto from "crypto";
import getRazorpayInstance from "../config/razorpay.js";
import mongoose from "mongoose";



export const createOrder = async (req, res) => {
  const razorpay = getRazorpayInstance();

  try {
    const { amount, shippingAddress, cartItems } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }

    if (!shippingAddress || !shippingAddress.fullName) {
      return res.status(400).json({
        success: false,
        message: "Shipping address required"
      });
    }

    // 🔥 1️⃣ Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    // 🔥 2️⃣ Save order in DB (IMPORTANT)
    const newOrder = await Order.create({
      user: req.user._id, 
      items: cartItems,
      shippingAddress,
      totalAmount: amount,
      razorpayOrderId: razorpayOrder.id,
      status: "pending"
    });

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      dbOrderId: newOrder._id
    });

  } catch (error) {
    console.error("RAZORPAY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Order creation failed"
    });
  }
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {

    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus }, // ✅ MUST match schema field          
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 🔥 FIND EXISTING ORDER
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔥 UPDATE ORDER
    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    res.json({
      success: true,
      message: "Payment verified"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


