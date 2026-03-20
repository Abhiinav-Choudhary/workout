import React, { useState } from "react";
import api from '../api/axios'
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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    } catch (error) {
      alert(
        error.response?.data?.message || "Something went wrong!"
      );
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

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          {/* Trainer Select */}
          <select
            name="trainer"
            value={formData.trainer}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="">Select Trainer</option>

            {trainers.map((trainer) => (
              <option key={trainer.id} value={trainer.name}>
                {trainer.name} - {trainer.specialty}
              </option>
            ))}

          </select>

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          {/* Time */}
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          {/* Message */}
          <textarea
            name="message"
            placeholder="Your fitness goal..."
            value={formData.message}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

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

export default Contact