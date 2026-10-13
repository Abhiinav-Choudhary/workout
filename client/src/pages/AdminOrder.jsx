import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  UserRound,
  IndianRupee,
  ChevronDown,
  AlertCircle,
  CalendarDays,
  ArrowUpRight,
  XCircle,
} from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrders, setUpdatingOrders] = useState([]);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/payment/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to load orders.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.message || "Something went wrong while fetching orders.");
    } finally {
      setLoading(false);
    }
  }, [API, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id, newStatus) => {
    const previousOrder = orders.find((order) => order._id === id);

    if (!previousOrder || previousOrder.orderStatus === newStatus) return;

    setError("");
    setUpdatingOrders((prev) => [...prev, id]);

    // Optimistic update: show the selected status immediately.
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id
          ? { ...order, orderStatus: newStatus }
          : order
      )
    );

    try {
      const res = await fetch(`${API}/api/payment/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Update status error:", err);

      // Roll back the optimistic update if the request fails.
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? { ...order, orderStatus: previousOrder.orderStatus }
            : order
        )
      );

      setError(err.message || "Could not update the order status.");
    } finally {
      setUpdatingOrders((prev) => prev.filter((orderId) => orderId !== id));
    }
  };

  const statusStyles = {
    pending: {
      badge: "bg-amber-50 text-amber-700 ring-amber-200",
      dot: "bg-amber-500",
      icon: Clock3,
    },
    processing: {
      badge: "bg-blue-50 text-blue-700 ring-blue-200",
      dot: "bg-blue-500",
      icon: Package,
    },
    shipped: {
      badge: "bg-violet-50 text-violet-700 ring-violet-200",
      dot: "bg-violet-500",
      icon: Truck,
    },
    "out for delivery": {
      badge: "bg-orange-50 text-orange-700 ring-orange-200",
      dot: "bg-orange-500",
      icon: Truck,
    },
    delivered: {
      badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
    },
    cancelled: {
      badge: "bg-red-50 text-red-700 ring-red-200",
      dot: "bg-red-500",
      icon: XCircle,
    },
  };

  const getStatus = (order) => order.orderStatus || "Processing";

  const getStatusConfig = (status) =>
    statusStyles[status.toLowerCase()] || {
      badge: "bg-gray-100 text-gray-700 ring-gray-200",
      dot: "bg-gray-500",
      icon: Package,
    };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const address = order.shippingAddress || {};
      const status = getStatus(order).toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      const matchesSearch =
        !query ||
        order._id?.toLowerCase().includes(query) ||
        order.user?.name?.toLowerCase().includes(query) ||
        address.fullName?.toLowerCase().includes(query) ||
        address.phone?.toLowerCase().includes(query) ||
        status.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (Number(order.totalAmount) || 0),
      0
    );

    return [
      {
        title: "Total Orders",
        value: orders.length,
        icon: ShoppingBag,
        accent: "bg-red-50 text-red-600",
      },
      {
        title: "Processing",
        value: orders.filter(
          (order) => getStatus(order).toLowerCase() === "processing"
        ).length,
        icon: Package,
        accent: "bg-blue-50 text-blue-600",
      },
      {
        title: "Shipped",
        value: orders.filter((order) =>
          ["shipped", "out for delivery"].includes(
            getStatus(order).toLowerCase()
          )
        ).length,
        icon: Truck,
        accent: "bg-violet-50 text-violet-600",
      },
      {
        title: "Delivered",
        value: orders.filter(
          (order) => getStatus(order).toLowerCase() === "delivered"
        ).length,
        icon: CheckCircle2,
        accent: "bg-emerald-50 text-emerald-600",
      },
      {
        title: "Order Value",
        value: formatCurrency(totalRevenue),
        icon: IndianRupee,
        accent: "bg-orange-50 text-orange-600",
      },
    ];
  }, [orders]);

  const StatusBadge = ({ status }) => {
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${config.badge}`}
      >
        <StatusIcon size={13} />
        {status}
      </span>
    );
  };

  const StatusSelect = ({ order }) => {
    const status = getStatus(order);
    const isUpdating = updatingOrders.includes(order._id);

    return (
      <div className="relative">
        <select
          value={status}
          disabled={isUpdating}
          onChange={(e) => updateStatus(order._id, e.target.value)}
          aria-label={`Update order ${order._id.slice(-6)} status`}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold text-gray-700 outline-none transition hover:border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 disabled:cursor-wait disabled:opacity-60 sm:w-48"
        >
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>

        {isUpdating ? (
          <RefreshCw
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-red-600"
          />
        ) : (
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-7">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              Store administration
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Orders <span className="text-red-600">Management</span>
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Track purchases, manage fulfilment, and keep every order moving.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-gray-950/10 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Orders
          </button>
        </header>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="mt-3 break-words text-2xl font-black tracking-tight text-gray-950">
                      {stat.value}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.accent}`}>
                    <Icon size={21} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                  <ArrowUpRight size={14} />
                  <span>Across all loaded orders</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="self-start rounded-lg px-3 py-1.5 font-bold hover:bg-red-100 sm:self-auto"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main orders panel */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-gray-950">
                  All Orders
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Review customer details and update delivery progress.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:min-w-64">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search order, customer..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter orders by status"
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-50 sm:min-w-44"
                  >
                    <option value="All">All statuses</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-gray-500">
              <span>
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {filteredOrders.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  {orders.length}
                </span>{" "}
                orders
              </span>

              {(search || statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700"
                >
                  <XCircle size={14} />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-4 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <RefreshCw size={25} className="animate-spin text-red-600" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Loading orders</p>
                <p className="mt-1 text-sm text-gray-500">
                  Fetching the latest order information...
                </p>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <ShoppingBag size={28} />
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-gray-900">
                {orders.length === 0 ? "No orders yet" : "No matching orders"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                {orders.length === 0
                  ? "Customer orders will appear here once purchases are placed."
                  : "Try another search term or change the selected status filter."}
              </p>

              {(search || statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="whitespace-nowrap px-6 py-4">Order</th>
                      <th className="whitespace-nowrap px-6 py-4">Customer</th>
                      <th className="whitespace-nowrap px-6 py-4">Shipping address</th>
                      <th className="whitespace-nowrap px-6 py-4">Amount</th>
                      <th className="whitespace-nowrap px-6 py-4">Status</th>
                      <th className="whitespace-nowrap px-6 py-4">Update status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => {
                      const address = order.shippingAddress || {};

                      return (
                        <tr
                          key={order._id}
                          className="align-top transition hover:bg-red-50/20"
                        >
                          <td className="px-6 py-5">
                            <p className="font-extrabold text-gray-950">
                              #{order._id.slice(-6).toUpperCase()}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              <CalendarDays
                                size={12}
                                className="mr-1 inline"
                              />
                              {formatDate(order.createdAt)}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                                <UserRound size={17} />
                              </div>
                              <div className="min-w-0">
                                <p className="max-w-44 break-words font-bold text-gray-900">
                                  {order.user?.name || address.fullName || "N/A"}
                                </p>
                                {address.phone && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    <Phone
                                      size={11}
                                      className="mr-1 inline"
                                    />
                                    {address.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="max-w-xs px-6 py-5">
                            {address.addressLine1 ? (
                              <div className="flex gap-2 text-sm text-gray-600">
                                <MapPin
                                  size={16}
                                  className="mt-0.5 shrink-0 text-red-500"
                                />
                                <div className="min-w-0">
                                  <p className="break-words font-semibold text-gray-800">
                                    {address.addressLine1}
                                  </p>
                                  {address.addressLine2 && (
                                    <p className="mt-0.5 break-words text-xs">
                                      {address.addressLine2}
                                    </p>
                                  )}
                                  <p className="mt-1 text-xs text-gray-500">
                                    {[address.city, address.state]
                                      .filter(Boolean)
                                      .join(", ")}
                                    {address.pincode
                                      ? ` - ${address.pincode}`
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">
                                No address available
                              </span>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-5">
                            <p className="text-base font-black text-gray-950">
                              {formatCurrency(order.totalAmount)}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge status={getStatus(order)} />
                          </td>

                          <td className="px-6 py-5">
                            <StatusSelect order={order} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tablet and mobile cards */}
              <div className="grid grid-cols-1 gap-4 bg-gray-50/50 p-4 sm:p-5 lg:hidden">
                {filteredOrders.map((order) => {
                  const address = order.shippingAddress || {};

                  return (
                    <article
                      key={order._id}
                      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Order ID
                          </p>
                          <p className="mt-1 text-lg font-black text-gray-950">
                            #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            <CalendarDays
                              size={12}
                              className="mr-1 inline"
                            />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <StatusBadge status={getStatus(order)} />
                      </div>

                      <div className="my-4 flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-500">
                            Order amount
                          </p>
                          <p className="mt-1 text-xl font-black text-red-600">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                          <ShoppingBag size={21} />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                            <UserRound size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-400">
                              Customer
                            </p>
                            <p className="mt-0.5 break-words text-sm font-bold text-gray-900">
                              {order.user?.name || address.fullName || "N/A"}
                            </p>
                            {address.phone && (
                              <p className="mt-1 text-xs text-gray-500">
                                {address.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                            <MapPin size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-400">
                              Delivery address
                            </p>
                            <p className="mt-0.5 break-words text-sm leading-5 text-gray-700">
                              {address.addressLine1
                                ? [
                                    address.addressLine1,
                                    address.addressLine2,
                                    address.city,
                                    address.state,
                                    address.pincode,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")
                                : "No address available"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-gray-100 pt-4">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                          Update order status
                        </label>
                        <StatusSelect order={order} />
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {!loading && orders.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>
                Displaying {filteredOrders.length} filtered order
                {filteredOrders.length === 1 ? "" : "s"}.
              </p>
              <p className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Order data loaded
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminOrders;
