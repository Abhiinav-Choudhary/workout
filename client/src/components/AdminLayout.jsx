import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  LogOut
} from "lucide-react";

const AdminLayout = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100";

  return (

    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}

      <aside className="w-64 bg-white shadow-md p-6">

        <h2 className="text-2xl font-bold text-red-600 mb-8">
          FlexForge Admin
        </h2>

        <nav className="flex flex-col gap-2">

          <NavLink to="/admin" className={linkClass}>
            <LayoutDashboard size={20}/>
            Dashboard
          </NavLink>

          <NavLink to="/admin/orders" className={linkClass}>
            <ShoppingCart size={20}/>
            Orders
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            <Package size={20}/>
            Products
          </NavLink>

          
    <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-10 text-red-500"
        >
          <LogOut size={18}/>
          Logout
        </button>
        </nav>

    
      </aside>

      {/* PAGE CONTENT */}

      <main className="flex-1 p-8">

        <Outlet />

      </main>

    </div>

  );

};

export default AdminLayout;