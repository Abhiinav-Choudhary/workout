import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { useNavigate , useLocation} from "react-router-dom";

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const location = useLocation();

const isBuyNow = location.state?.isBuyNow;
const product = location.state?.product;

const finalAmount = isBuyNow
  ? (product.discountPrice || product.price)
  : total;

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: ""
  });

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // 🔹 handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 validation
  const validate = () => {
    if (!form.fullName || !form.phone || !form.addressLine1 || !form.city || !form.state || !form.pincode) {
      alert("Please fill all required fields");
      return false;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      alert("Invalid phone number");
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      alert("Invalid pincode");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validate()) return;

    console.log("DEBUG:", {
    finalAmount,
    product,
    cart,
    form
  });

  if (!finalAmount) {
    alert("Amount missing");
    return;
  }

  if (!form.fullName || !form.phone || !form.addressLine1) {
    alert("Fill address properly");
    return;
  }

  const res = await fetch(`${API}/api/payment/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      amount: finalAmount,
      cartItems: isBuyNow ? [product] : cart,
      shippingAddress: form
    })
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    console.error("ERROR:", data);
    alert(data.message || "Order failed");
    return;
  }

  if (!data.order) {
  alert("Order creation failed");
  return;
}

    // 2️⃣ Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: "INR",
      order_id: data.order.id,

     handler: async function (response) {
  const res = await fetch(`${API}/api/payment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Payment verification failed");
    return;
  }


        clearCart();
        alert("Order placed successfully 🎉");
        navigate("/profile/orders");
      }
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>

      <input name="fullName" placeholder="Full Name" onChange={handleChange} className="w-full border p-2 mb-3" />

      <input name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full border p-2 mb-3" />

      <input name="addressLine1" placeholder="Address Line 1" onChange={handleChange} className="w-full border p-2 mb-3" />

      <input name="addressLine2" placeholder="Address Line 2" onChange={handleChange} className="w-full border p-2 mb-3" />

      <input name="city" placeholder="City" onChange={handleChange} className="w-full border p-2 mb-3" />

      <input name="state" placeholder="State" onChange={handleChange} className="w-full border p-2 mb-3" />

      <input name="pincode" placeholder="Pincode" onChange={handleChange} className="w-full border p-2 mb-3" />

      <button
        onClick={handlePayment}
        className="w-full bg-red-500 text-white py-2 rounded"
      >
        Pay ₹{finalAmount}
      </button>
    </div>
  );
};

export default Checkout;