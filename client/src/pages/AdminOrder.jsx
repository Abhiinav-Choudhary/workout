import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/api/payment/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setOrders(prev =>
        prev.map(order =>
          order._id === id
            ? { ...order, orderStatus: status }
            : order
        )
      );

      await fetch(`${API}/api/payment/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: status })
      });

    } catch (error) {
      console.error(error);
    }
  };

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    "out for delivery": "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Orders Management
      </h1>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Address</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => {
              const status = order.orderStatus || "Processing";
              const normalizedStatus = status.toLowerCase();
              const address = order.shippingAddress;

              return (
                <tr key={order._id} className="border-b align-top">

                  <td className="p-4">{order._id.slice(-6)}</td>

                  <td className="p-4">
                    {order.user?.name || "N/A"}
                  </td>

                  <td className="p-4 font-semibold text-red-600">
                    ₹{order.totalAmount}
                  </td>

                  <td className="p-4 max-w-xs text-xs">
                    {address ? (
                      <>
                        <p className="font-semibold">{address.fullName}</p>
                        <p>{address.phone}</p>
                        <p>{address.addressLine1}, {address.addressLine2}</p>
                        <p>{address.city}, {address.state}</p>
                        <p>{address.pincode}</p>
                      </>
                    ) : "No address"}
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      statusStyles[normalizedStatus] || "bg-gray-100"
                    }`}>
                      {status}
                    </span>
                  </td>

                  <td className="p-4">
                    <select
                      value={status}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* ✅ Mobile Card View */}
      <div className="md:hidden space-y-4">

        {orders.map(order => {
          const status = order.orderStatus || "Processing";
          const normalizedStatus = status.toLowerCase();
          const address = order.shippingAddress;

          return (
            <div key={order._id} className="bg-white shadow rounded-xl p-4 space-y-3">

              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">
                  #{order._id.slice(-6)}
                </span>

                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  statusStyles[normalizedStatus] || "bg-gray-100"
                }`}>
                  {status}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                👤 {order.user?.name || "N/A"}
              </p>

              <p className="text-sm font-semibold text-red-600">
                ₹{order.totalAmount}
              </p>

              {address && (
                <div className="text-xs text-gray-600">
                  <p className="font-semibold">{address.fullName}</p>
                  <p>{address.phone}</p>
                  <p>{address.addressLine1}</p>
                  <p>{address.city}, {address.state}</p>
                </div>
              )}

              <select
                value={status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default AdminOrders;