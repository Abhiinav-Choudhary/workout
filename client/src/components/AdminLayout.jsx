import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Dumbbell } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeSidebar = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Shared sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={closeSidebar}
      />

      {/* Main area */}
      <div className="min-w-0 flex-1">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100"
          >
            <Menu size={23} />
          </button>

          <div className="flex items-center gap-2">
            <Dumbbell size={21} className="text-red-600" />
            <span className="text-sm font-black tracking-wide text-gray-950">
              FLEX<span className="text-red-600">FORGE</span>
            </span>
          </div>

          <div className="w-10" />
        </header>

        {/* Current admin page */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
