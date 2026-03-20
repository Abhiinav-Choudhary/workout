import React, { useEffect, useState } from "react";
import { Loader2, Package, Settings, Truck, Bike, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (data.success) setOrders(data.orders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const steps = [
    { label: "Pending", icon: <Package size={18} /> },
    { label: "Processing", icon: <Settings size={18} /> },
    { label: "Shipped", icon: <Truck size={18} /> },
    { label: "Out for Delivery", icon: <Bike size={18} /> },
    { label: "Delivered", icon: <CheckCircle size={18} /> },
  ];

  const statusMessages = {
    Pending: "Your order has been placed 📦",
    Processing: "We are preparing your order ⚙️",
    Shipped: "Your order is on the way 🚚",
    "Out for Delivery": "Out for delivery 🚴",
    Delivered: "Delivered successfully 🎉",
  };

 const OrderTracker = ({ currentStatus }) => {

  const currentIndex = steps.findIndex(
    (step) =>
      step.label.toLowerCase() === currentStatus?.toLowerCase()
  );

  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="mt-6">

      <div className="relative h-2 bg-gray-200 rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${(safeIndex / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.6 }}
          className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
        />
      </div>

      <div className="flex justify-between mt-4">
        {steps.map((step, index) => {
          const isActive = index <= safeIndex;
          const isCurrent = index === safeIndex;

          return (
            <div key={step.label} className="flex flex-col items-center w-full">

              <motion.div
                animate={{ scale: isCurrent ? 1.2 : 1 }}
                className={`w-10 h-10 flex items-center justify-center rounded-full
                  ${isActive
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-300 text-gray-600"
                  }`}
              >
                {step.icon}
              </motion.div>

              <p className={`text-xs mt-2 text-center
                ${isActive ? "text-green-600 font-semibold" : "text-gray-500"}
              `}>
                {step.label}
              </p>

            </div>
          );
        })}
      </div>
    </div>
  );
};

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-red-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {

            const deliveryDate = new Date(
              new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000
            );

            return (
              <div key={order._id} className="bg-white rounded-xl shadow p-6">

                {/* Header */}
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">
                    Order #{order._id.slice(-6)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Items */}
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-4 mb-3">
                    <img
                      src={item.image}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Status Row */}
                <div className="flex justify-between mt-4 items-center">
                  <span className="font-bold text-red-600">
                    ₹{order.totalAmount}
                  </span>

                  <div className="flex gap-3">
                    <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700">
                      {order.paymentStatus}
                    </span>

                    <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Status Message */}
                <p className="text-sm mt-2 text-gray-600">
                  {statusMessages[order.orderStatus]}
                </p>

                {/* Delivery Date */}
                <p className="text-sm text-gray-500 mt-1">
                  Expected Delivery: {deliveryDate.toDateString()}
                </p>

                {/* 🔥 TRACKER */}
                <OrderTracker currentStatus={order.orderStatus} />

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileOrders;