import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Menu,
  X,
  Instagram,
  Youtube,
  Facebook,
  User,
  LogOut
} from "lucide-react";
import { useNavigate, Link, Outlet } from "react-router-dom";

const HeaderFooterLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/95 backdrop-blur-md shadow-lg py-3"
            : "bg-black/90 backdrop-blur-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 sm:gap-3">
            <Dumbbell className="text-red-500" size={28} />
            <span className="text-xl sm:text-2xl font-bold text-white">
              Flex<span className="text-red-500">Forge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {["Home", "Equipment", "Calisthenics", "Fitbot", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="px-3 py-2 text-sm text-gray-300 hover:text-white transition"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">

            {user ? (
              <div className="hidden md:flex items-center gap-2">

                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <User size={18} />
                  <span className="text-sm">
                    {user.name?.split(" ")[0]}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  <LogOut size={18} className="text-red-400" />
                </button>

              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
            >
              {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden bg-gray-900 px-4 pb-6 pt-4 space-y-2">

            {["Home", "Equipment", "Calisthenics", "Fitbot", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10"
              >
                {item}
              </Link>
            ))}

            <div className="pt-4 border-t border-white/10 space-y-2">

              {user ? (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-3 bg-white/10 rounded-lg"
                  >
                    {user.name}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-red-500 rounded-lg text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="w-full px-4 py-3 bg-red-500 rounded-lg text-white"
                >
                  Sign In
                </button>
              )}

            </div>

          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="pt-20 min-h-screen bg-gray-50">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="text-red-500" />
                <span className="text-xl font-bold text-white">
                  FlexForge
                </span>
              </div>
              <p className="text-sm">
                Premium workout gear for modern athletes.
              </p>

              <div className="flex gap-3 mt-4">
                <Instagram />
                <Youtube />
                <Facebook />
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/equipment">Equipment</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/shipping">Shipping</Link></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm">
            © {new Date().getFullYear()} FlexForge
          </div>

        </div>
      </footer>
    </>
  );
};

export default HeaderFooterLayout;