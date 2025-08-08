import React, { useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    district: "",
    category: "",
    image: null,
    organizedBy: "",
    contact: "",
    address: "",
    maxAttendees: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const districts = [
    "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru",
    "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya",
    "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgiri"
  ];

  const categories = [
    "Business", "Dance", "Education", "Health", "Food", "Arts", "Workshop", "Finance"
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        image: files && files[0] ? files[0] : null,
      }));
    } else if (name === "contact") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: digitsOnly,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image" && value) {
        data.append("image", value);
      } else {
        data.append(key, value);
      }
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/admin/events",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Event added successfully!");
        setErrorMessage("");
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          district: "",
          category: "",
          image: null,
          organizedBy: "",
          contact: "",
          address: "",
          maxAttendees: "",
        });
      }
    } catch (error) {
      console.error("Failed to add event:", error.response?.data || error.message);
      setErrorMessage("Failed to add event, try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-700 flex items-center gap-2">
          <svg className="h-7 w-7 text-orange-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M17 20h5v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1h5m10 0v-1a5 5 0 00-10 0v1m10 0a5 5 0 00-10 0M17 11V8a5 5 0 00-10 0v3" />
          </svg>
          Post a New Local Event
        </h2>

        {successMessage && <div className="mb-4 rounded-lg bg-green-50 text-green-700 p-3 text-center">{successMessage}</div>}
        {errorMessage && <div className="mb-4 rounded-lg bg-red-50 text-red-600 p-3 text-center">{errorMessage}</div>}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Event Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event Title"
              className="input w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the event..."
              className="input w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
              rows="3"
              required
            />
          </div>
          <div className="md:flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="input w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="md:flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="input w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              >
                <option value="">Select District</option>
                {districts.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="input w-full border px-3 py-2 rounded file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-orange-50 file:text-orange-700"
              required
            />
          </div>
          <div className="md:flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">Organized By</label>
              <input
                type="text"
                name="organizedBy"
                value={formData.organizedBy}
                onChange={handleChange}
                placeholder="Person/Organization"
                className="input w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contact"
                placeholder="Contact Info"
                value={formData.contact}
                onChange={handleChange}
                className="input w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
                maxLength={10}
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Event Address"
              className="input w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Max Attendees <span className="text-gray-400 text-xs ml-1">(Leave empty for Free for All)</span>
            </label>
            <input
              type="number"
              min={1}
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              placeholder="Max Attendees"
              className="input w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold py-2 rounded shadow-lg hover:from-orange-700 hover:to-orange-800 transition"
          >
            Submit Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
