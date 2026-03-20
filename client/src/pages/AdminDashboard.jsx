import React, { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenue: 0
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingBag size={24} />,
      color: "bg-blue-500"
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <Package size={24} />,
      color: "bg-green-500"
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: <Users size={24} />,
      color: "bg-purple-500"
    },
    {
      title: "Revenue",
      value: `₹${stats.revenue}`,
      icon: <IndianRupee size={24} />,
      color: "bg-red-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

       

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-4 sm:p-6 flex items-center gap-4 hover:shadow-lg transition"
          >

            <div className={`${card.color} text-white p-2 sm:p-3 rounded-lg`}>
              {card.icon}
            </div>

            <div>
              <p className="text-gray-500 text-xs sm:text-sm">
                {card.title}
              </p>

              <p className="text-lg sm:text-xl font-bold text-gray-800">
                {card.value}
              </p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminDashboard;