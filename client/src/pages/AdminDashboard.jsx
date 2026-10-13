import React, { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  LogOut,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
  Activity,
  Boxes,
  UserRound,
  AlertCircle,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        throw new Error("Your session may have expired. Please log in again.");
      }

      if (!res.ok) {
        throw new Error("Unable to load dashboard statistics.");
      }

      const data = await res.json();

      setStats({
        totalOrders: Number(data.totalOrders) || 0,
        totalProducts: Number(data.totalProducts) || 0,
        totalUsers: Number(data.totalUsers) || 0,
        revenue: Number(data.revenue) || 0,
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError(err.message || "Something went wrong while loading statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString("en-IN"),
      description: "Orders in your store",
      icon: ShoppingBag,
      iconStyle: "bg-red-50 text-red-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString("en-IN"),
      description: "Products in inventory",
      icon: Package,
      iconStyle: "bg-orange-50 text-orange-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString("en-IN"),
      description: "Registered customers",
      icon: Users,
      iconStyle: "bg-rose-50 text-rose-600",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.revenue.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`,
      description: "Revenue reported by API",
      icon: IndianRupee,
      iconStyle: "bg-gray-100 text-gray-800",
    },
  ];

  const quickActions = [
    {
      title: "Manage Products",
      description: "View and manage your inventory",
      icon: Package,
      onClick: () => navigate("/admin/products"),
    },
    {
      title: "Manage Orders",
      description: "Review customer orders",
      icon: ShoppingBag,
      onClick: () => navigate("/admin/orders"),
    },
    {
      title: "Manage Users",
      description: "View registered customers",
      icon: Users,
      onClick: () => navigate("/admin/users"),
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f6f7] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Page header */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-red-600">
              <LayoutDashboard size={15} />
              Store management
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Admin Dashboard<span className="text-red-600">.</span>
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Monitor your store and manage your business from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchStats}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-red-200 hover:text-red-600 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* Welcome banner */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-[#171717] p-6 text-white sm:p-8 lg:p-10">
          <div className="absolute -right-12 -top-24 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute -bottom-28 right-1/3 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300">
                <ShieldCheck size={14} />
                Administrator access
              </div>

              <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">
                Welcome back, Admin
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                Here's your store overview. Keep track of your products,
                customers, orders, and revenue.
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-2xl border border-white/10 bg-white/5 sm:self-auto">
              <Activity size={32} className="text-red-500" />
            </div>
          </div>
        </section>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600" />
              <div>
                <p className="font-bold text-red-800">
                  Couldn't load dashboard
                </p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchStats}
              className="shrink-0 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Statistics */}
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-950">
                Store overview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Key business metrics
              </p>
            </div>

            <span className="hidden items-center gap-2 text-xs font-medium text-gray-400 sm:flex">
              <span
                className={`h-2 w-2 rounded-full ${
                  loading ? "animate-pulse bg-orange-400" : error ? "bg-red-500" : "bg-emerald-500"
                }`}
              />
              {loading ? "Updating..." : error ? "Update failed" : "Data loaded"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-lg hover:shadow-red-950/5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {card.title}
                      </p>

                      <p className="mt-3 break-words text-3xl font-black tracking-tight text-gray-950">
                        {loading ? (
                          <span className="inline-block h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
                        ) : (
                          card.value
                        )}
                      </p>
                    </div>

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition group-hover:scale-105 ${card.iconStyle}`}
                    >
                      <Icon size={23} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <p className="text-xs text-gray-500">
                      {card.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-gray-950">
              Quick actions
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Jump straight into store management.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  type="button"
                  key={action.title}
                  onClick={action.onClick}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-red-200 hover:shadow-lg hover:shadow-red-950/5 sm:p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {action.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={19}
                    className="shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-red-600"
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-gray-200 py-6 text-xs text-gray-400 sm:flex-row sm:items-center">
          <p>Workout Store · Administration</p>
          <p className="flex items-center gap-2">
            <Boxes size={14} />
            Store management dashboard
          </p>
        </footer>
      </div>
    </main>
  );
};

export default AdminDashboard;
