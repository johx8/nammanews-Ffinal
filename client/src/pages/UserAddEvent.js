import React, { useState } from "react";
import axios from "axios";

const districts = [
  "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru",
  "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya",
  "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgiri"
];

const categories = [
  "Business", "Dance", "Education", "Health", "Food", "Arts", "Workshop", "Finance", "Advertisements"
];

const UserAddEvent = () => {
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
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files && files[0] ? files[0] : null;
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else if (name === "contact") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, contact: digitsOnly }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
      await axios.post("http://localhost:5000/api/user/events", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage("🎉 Event submitted successfully! Pending admin approval.");
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
      setImagePreview(null);
    } catch (error) {
      setErrorMessage("❌ Failed to submit event. Try again.");
      setSuccessMessage("");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-orange-50 py-8 px-3">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl px-7 py-10 animate-fadeIn">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-orange-700 flex items-center gap-2 justify-center">
          <svg className="h-8 w-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M17 20h5v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1h5m10 0v-1a5 5 0 00-10 0v1m10 0a5 5 0 00-10 0M17 11V8a5 5 0 00-10 0v3" />
          </svg>
          Submit a New Event
        </h2>

        {successMessage && (
          <div className="mb-4 rounded-xl bg-green-50 text-green-700 p-3 text-center font-semibold">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 rounded-xl bg-red-50 text-red-700 p-3 text-center font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Event Title <span className="text-orange-500">*</span></label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event Title"
              required
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-base bg-gray-50"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Description <span className="text-orange-500">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your event..."
              rows={3}
              required
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-base bg-gray-50 resize-y"
            />
          </div>
          <div className="flex flex-col md:flex-row md:gap-4 gap-3">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">Date <span className="text-orange-500">*</span></label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none bg-gray-50"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">Time <span className="text-orange-500">*</span></label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none bg-gray-50"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4 gap-3">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">District <span className="text-orange-500">*</span></label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none bg-gray-50"
              >
                <option value="">Select District</option>
                {districts.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">Category <span className="text-orange-500">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none bg-gray-50"
              >
                <option value="">Select Category</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Event Poster <span className="text-orange-500">*</span></label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              disabled={submitting}
              className="w-full file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:outline-none"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-3 mx-auto rounded-xl shadow border max-h-52 object-contain" />
            )}
          </div>
          <div className="flex flex-col md:flex-row md:gap-4 gap-3">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">Organized By <span className="text-orange-500">*</span></label>
              <input
                type="text"
                name="organizedBy"
                value={formData.organizedBy}
                onChange={handleChange}
                placeholder="Person/Organization"
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none bg-gray-50"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">Contact Number <span className="text-orange-500">*</span></label>
              <input
                type="text"
                name="contact"
                placeholder="10-digit phone number"
                value={formData.contact}
                onChange={handleChange}
                maxLength={10}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Event Address <span className="text-orange-500">*</span></label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
              required
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-base bg-gray-50"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Max Attendees
              <span className="text-gray-400 text-xs ml-1">(Leave empty for Free for All)</span>
            </label>
            <input
              type="number"
              min={1}
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              placeholder="Max Attendees"
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-base bg-gray-50"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={`mt-4 w-full py-3 rounded-xl text-lg font-bold shadow-md transition bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-400 focus:outline-none
              ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {submitting ? "Submitting..." : "Submit Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAddEvent;
