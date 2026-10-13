import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  LogOut,
  Dumbbell,
  X,
  ChevronRight,
} from "lucide-react";

const AdminSidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();

  const links = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onClose?.();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#111111] text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand */}
      <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-6">
        <button
          type="button"
          onClick={() => {
            navigate("/admin/dashboard");
            onClose?.();
          }}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20">
            <Dumbbell size={23} strokeWidth={2.5} />
          </div>

          <div>
            <h1 className="text-lg font-black tracking-wide">
              FLEX<span className="text-red-500">FORGE</span>
            </h1>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Admin Panel
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-7">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Workspace
        </p>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3.5 py-3.5 transition-all duration-200 ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <Icon size={19} strokeWidth={2} />
                      <span className="text-sm font-semibold">
                        {link.name}
                      </span>
                    </span>

                    {isActive && (
                      <ChevronRight size={16} className="text-white/80" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Store shortcut */}
        <div className="mt-10">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            Storefront
          </p>

          <button
            type="button"
            onClick={() => {
              navigate("/home");
              onClose?.();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3.5 text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Store size={19} />
            <span className="text-sm font-semibold">Back to Store</span>
          </button>
        </div>
      </div>

      {/* Admin profile and logout */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.05] p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/15 text-red-400">
            <LayoutDashboard size={19} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              Administrator
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Store management
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-gray-400 transition hover:bg-red-600/10 hover:text-red-400"
        >
          <LogOut size={19} />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
