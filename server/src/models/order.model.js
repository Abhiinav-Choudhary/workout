import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        title: String,
        price: Number,
        quantity: Number,
        image: String
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    orderStatus:{
    type:String,
    enum:[
     "pending",
     "processing",
     "shipped",
     "out for delivery",
      "delivered"
    ],
    default:"pending"
  },

    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "wallet"]
    },

    // 🔐 Razorpay fields
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    // 📦 Shipping (optional now, required later)
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
