import React, { useState } from 'react';
import axios from 'axios';

const districts = [
  "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru",
  "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya",
  "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgiri"
];

const categories = [
  "Business", "Dance", "Education", "Health", "Food", "Arts", "Workshop", "Finance"
];

const UploadAdvertisementForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    redirectUrl: '',
    contact: '',
    district: '',
    category: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
      return;
    }

    if (name === 'contact') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, contact: digitsOnly }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });
      payload.append('postedAt', new Date().toISOString());

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/advertisements', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Advertisement added successfully!');
      setFormData({
        title: '',
        description: '',
        redirectUrl: '',
        contact: '',
        district: '',
        category: '',
        image: null,
      });
      setPreview(null);
    } catch (error) {
      console.error('Ad upload failed:', error);
      alert('Failed to upload advertisement');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl px-7 py-10 shadow-2xl animate-fadeIn">
        <h2 className="text-3xl font-extrabold mb-8 text-orange-700 tracking-tight text-center">Add Advertisement</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Title <span className="text-orange-600">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
              placeholder="Advertisement Title"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">Description <span className="text-orange-600">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50 resize-y min-h-[80px]"
              placeholder="Describe your ad"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">Redirect URL <span className="text-orange-600">*</span></label>
            <input
              type="url"
              name="redirectUrl"
              placeholder="https://..."
              value={formData.redirectUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">Contact No. <span className="text-orange-600">*</span></label>
            <input
              type="text"
              name="contact"
              placeholder="10-digit phone number"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
              required
              pattern="\d{10}"
              maxLength={10}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">Image <span className="text-orange-600">*</span></label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:outline-none"
              required
              disabled={submitting}
            />
            {preview && (
              <img src={preview}
                   alt="Preview"
                   className="mt-2 mx-auto rounded-xl shadow border max-h-56 object-contain"
              />
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">District <span className="text-orange-600">*</span></label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
                required
                disabled={submitting}
              >
                <option value="">Select District</option>
                {districts.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">Category <span className="text-orange-600">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
                required
                disabled={submitting}
              >
                <option value="">Select Category</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full mt-2 py-3 rounded-xl text-lg font-bold shadow-md transition bg-orange-600 hover:bg-orange-700 text-white focus:ring-2 focus:ring-orange-400 focus:outline-none ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Uploading..." : "Upload Advertisement"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadAdvertisementForm;
