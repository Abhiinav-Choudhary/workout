// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HeaderFooterLayout from "./components/Layout";
import Calisthenics from "./pages/Calisthenics";
import Home from "./pages/Home";
import Equipment from "./pages/Equipment";
import ProductDetail from "./pages/ProductDetail";
import Chatbot from "./pages/Chatbot";
import Contact from "./pages/Contact";
import Login from "./pages/login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ProfileOrders from "./pages/ProfileOrders";
import AdminOrders from "./pages/AdminOrder";
import AdminLayout from "./components/AdminLayout";
import AdminProducts from "./pages/AdminProducts";
import Checkout from "./pages/Checkout";



const App = () => {
  return (
    <Router>
      <Routes>

        {/* Routes WITHOUT Header & Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
     <Route path="/admin" element={<AdminLayout />}>

  {/* Default route */}
  <Route index element={<AdminDashboard />} />

  {/* Relative paths */}
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="orders" element={<AdminOrders />} />
  <Route path="products" element={<AdminProducts />} />

</Route>

        {/* Routes WITH Header & Footer */}
        <Route element={<HeaderFooterLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/calisthenics" element={<Calisthenics/>} />
          <Route path="/equipment/:id" element={<ProductDetail />} />
          <Route path="/fitbot" element={<Chatbot />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
         <Route path="/checkout" element={<Checkout />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
