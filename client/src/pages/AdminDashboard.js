import React, { useState } from "react";
import axios from "axios";

const districts = [
  "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru",
  "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya",
  "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgiri"
];

const categories = [
  "Business", "Dance", "Education", "Health", "Food", "Arts", "Workshop", "Finance"
];

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

  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        image: files && files[0] ? files[0] : null,
      }));
      setPreview(files && files[0] ? URL.createObjectURL(files[0]) : null);
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
    setSubmitting(true);

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
        setPreview(null);
      }
    } catch (error) {
      console.error("Failed to add event:", error.response?.data || error.message);
      setErrorMessage("Failed to add event, try again.");
      setSuccessMessage("");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl px-6 py-10 md:p-12 animate-fadeIn">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-orange-700 flex items-center gap-2 justify-center">
          <svg className="h-8 w-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M17 20h5v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1h5m10 0v-1a5 5 0 00-10 0v1m10 0a5 5 0 00-10 0M17 11V8a5 5 0 00-10 0v3" />
          </svg>
          Post a New Local Event
        </h2>

        {successMessage && <div className="mb-4 rounded-xl bg-green-50 text-green-700 p-3 text-center font-semibold">{successMessage}</div>}
        {errorMessage && <div className="mb-4 rounded-xl bg-red-50 text-red-600 p-3 text-center font-semibold">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Event Title <span className="text-orange-500">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event Title"
              required
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Description <span className="text-orange-500">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the event..."
              rows={4}
              required
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50 resize-y"
            />
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">Date <span className="text-orange-500">*</span></label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">Time <span className="text-orange-500">*</span></label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">District <span className="text-orange-500">*</span></label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
              >
                <option value="">Select District</option>
                {districts.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">Category <span className="text-orange-500">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
              >
                <option value="">Select Category</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Event Poster <span className="text-orange-500">*</span></label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              disabled={submitting}
              className="w-full file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:outline-none"
            />
            {preview && (
              <img src={preview} alt="Preview"
                   className="mt-3 mx-auto rounded-xl shadow border max-h-52 object-contain" />
            )}
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">Organized By <span className="text-orange-500">*</span></label>
              <input
                type="text"
                name="organizedBy"
                value={formData.organizedBy}
                onChange={handleChange}
                placeholder="Person/Organization"
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1 text-gray-700">Contact Number <span className="text-orange-500">*</span></label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                maxLength={10}
                pattern="\d{10}"
                placeholder="10 digit number"
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Address <span className="text-orange-500">*</span></label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Event address"
              required
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Max Attendees
              <span className="text-gray-400 text-xs ml-1">(Leave empty for Free for All)</span>
            </label>
            <input
              type="number"
              name="maxAttendees"
              value={formData.maxAttendees}
              min={1}
              onChange={handleChange}
              placeholder="Max Attendees"
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`mt-4 w-full py-3 rounded-xl text-lg font-bold shadow-md transition bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 focus:ring-2 focus:ring-orange-400 focus:outline-none ${
              submitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Submitting..." : "Submit Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
