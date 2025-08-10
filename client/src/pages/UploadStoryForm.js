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

const UploadStoryForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    district: '',
    category: '',
    youtubeLink: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    try {
      const data = new FormData();
      for (const key in formData) data.append(key, formData[key]);
      if (image) data.append('image', image);

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/stories', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess('✅ Story uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        district: '',
        category: '',
        youtubeLink: ''
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error('Story upload failed:', err);
      setSuccess('❌ Failed to upload story.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-xl bg-white rounded-2xl px-7 py-10 shadow-2xl animate-fadeIn">
        <h2 className="text-3xl font-extrabold mb-8 text-orange-700 tracking-tight text-center">
          Add New Story
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Title <span className="text-orange-600">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 bg-gray-50"
              placeholder="Story Title"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Description <span className="text-orange-600">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={submitting}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 bg-gray-50 resize-y"
              placeholder="Write your story..."
            />
          </div>
          <div className="flex flex-col md:flex-row md:gap-4 gap-3">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">Date <span className="text-orange-600">*</span></label>
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
              <label className="block font-semibold mb-1 text-gray-700">Time <span className="text-orange-600">*</span></label>
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
              <label className="block font-semibold mb-1 text-gray-700">District <span className="text-orange-600">*</span></label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none bg-gray-50"
              >
                <option value="">Select District</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">Category <span className="text-orange-600">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none bg-gray-50"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">YouTube Link <span className="text-gray-400 text-xs">(optional)</span></label>
            <input
              type="url"
              name="youtubeLink"
              value={formData.youtubeLink}
              onChange={handleChange}
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 bg-gray-50"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Story Image <span className="text-orange-600">*</span></label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              disabled={submitting}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:outline-none"
            />
            {preview && (
              <img
                src={preview}
                alt="Story Preview"
                className="mt-3 mx-auto rounded-xl shadow border max-h-48 object-contain"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={`w-full mt-2 py-3 rounded-xl text-lg font-bold shadow-md transition bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 focus:ring-2 focus:ring-orange-400 focus:outline-none
            ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {submitting ? "Uploading..." : "Upload Story"}
          </button>
          {success && (
            <div className={`mt-6 text-center text-base font-semibold rounded-xl py-2 px-4 ${
              success.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadStoryForm;
