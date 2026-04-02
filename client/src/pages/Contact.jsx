import React, { useState } from "react";
import api from "../api/axios";

const trainers = [
  { id: 1, name: "Rahul Sharma", specialty: "Weight Loss Coach" },
  { id: 2, name: "Ankit Verma", specialty: "Strength Trainer" },
  { id: 3, name: "Neha Kapoor", specialty: "Yoga Instructor" },
];

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    trainer: "",
    date: "",
    time: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Validation Function
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10-digit phone number";
    }

    if (!formData.trainer) {
      newErrors.trainer = "Please select a trainer";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Cannot select past date";
      }
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    if (formData.message && formData.message.length < 5) {
      newErrors.message = "Message must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await api.post("/appointments/book", formData);

      alert(res.data.message || "Appointment booked successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        trainer: "",
        date: "",
        time: "",
        message: "",
      });

      setErrors({});
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          Book Appointment With Trainer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}

          {/* Trainer */}
          <select
            name="trainer"
            value={formData.trainer}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Select Trainer</option>
            {trainers.map((trainer) => (
              <option key={trainer.id} value={trainer.name}>
                {trainer.name} - {trainer.specialty}
              </option>
            ))}
          </select>
          {errors.trainer && (
            <p className="text-red-500 text-sm">{errors.trainer}</p>
          )}

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border p-3 rounded-lg"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date}</p>
          )}

          {/* Time */}
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
          {errors.time && (
            <p className="text-red-500 text-sm">{errors.time}</p>
          )}

          {/* Message */}
          <textarea
            name="message"
            placeholder="Your fitness goal..."
            value={formData.message}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;