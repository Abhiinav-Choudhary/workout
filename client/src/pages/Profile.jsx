import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Loader2, 
  Edit2, 
  Save, 
  X,
  Package,
  Heart,
  Settings,
  LogOut
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    }
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        window.location.href = "/login";
        return;
      }

      // First, use data from localStorage
      const localUser = JSON.parse(userData);
      setUser(localUser);
      setFormData({
        name: localUser.name || "",
        phone: localUser.phone || "",
        address: localUser.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: ""
        }
      });

      // Then fetch fresh data from API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          address: data.user.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
          }
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      // Don't redirect on error, use cached data
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setSuccess("Profile updated successfully!");
        setEditing(false);
        
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      }
    });
    setError("");
    setSuccess("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-red-500" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Unable to load profile</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 flex items-center gap-2">
            <span className="text-xl">✓</span>
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - User Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl">
                  <User className="text-white" size={64} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              {/* Role Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 ${
                user.role === "admin" 
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" 
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              }`}>
                <Shield size={16} />
                {user.role === "admin" ? "Admin Account" : "Customer"}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 mb-6">
                <div>
                  <div className="text-2xl font-bold text-red-500">0</div>
                  <div className="text-xs text-gray-600">Orders</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">0</div>
                  <div className="text-xs text-gray-600">Wishlist</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">0</div>
                  <div className="text-xs text-gray-600">Reviews</div>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-4">
                <Calendar size={16} />
                <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition" onClick={()=>navigate('/profile/orders')}>
                  <Package size={18} className="text-red-500" />
                  <span>My Orders</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  <Heart size={18} className="text-red-500" />
                  <span>Wishlist</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  <Settings size={18} className="text-red-500" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 pb-6 border-b">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
                  <p className="text-gray-600 text-sm mt-1">Manage your personal details and shipping address</p>
                </div>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition disabled:opacity-50 shadow-md"
                    >
                      {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition shadow-md"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <User size={18} className="text-red-500" />
                  </div>
                  Personal Information
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition ${
                        editing 
                          ? "border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="Enter phone number"
                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg transition ${
                          editing 
                            ? "border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                            : "bg-gray-50 border-gray-200 text-gray-700"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <MapPin size={18} className="text-red-500" />
                  </div>
                  Shipping Address
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address?.street || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="123 Main Street, Apt 4B"
                    className={`w-full px-4 py-3 border-2 rounded-lg transition ${
                      editing 
                        ? "border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address?.city || ""}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="City"
                      className={`w-full px-4 py-3 border-2 rounded-lg transition ${
                        editing 
                          ? "border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State / Province</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address?.state || ""}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="State"
                      className={`w-full px-4 py-3 border-2 rounded-lg transition ${
                        editing 
                          ? "border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP / Postal Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address?.zipCode || ""}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="12345"
                      className={`w-full px-4 py-3 border-2 rounded-lg transition ${
                        editing 
                          ? "border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address?.country || ""}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="Country"
                      className={`w-full px-4 py-3 border-2 rounded-lg transition ${
                        editing 
                          ? "border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;