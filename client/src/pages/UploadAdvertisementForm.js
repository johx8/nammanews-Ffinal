import React, { useState } from 'react';
import axios from 'axios';

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


  const districts = [
    "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru",
    "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya",
    "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgiri"
  ];

  const categories = [
    "Business", "Dance", "Education", "Health", "Food", "Arts", "Workshop", "Finance"
  ];

  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === 'image') {
    setFormData((prev) => ({ ...prev, image: files[0] }));
    return; // stop here so you don't overwrite it
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
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });
      payload.append('postedAt', new Date().toISOString());

      const token = localStorage.getItem('token'); // adjust if using different storage
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
    } catch (error) {
      console.error('Ad upload failed:', error);
      alert('Failed to upload advertisement');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Advertisement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="input" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="textarea" required />
        <input type="url" name="redirectUrl" placeholder="Redirect URL" value={formData.redirectUrl} onChange={handleChange} className="input" required />
        <input
  type="text"
  name="contact"
  placeholder="Contact Info"
  value={formData.contact}
  onChange={handleChange}
  className="input"
  required
  maxLength={10}
/>
        <input type="file" name="image" accept="image/*" onChange={handleChange} className="input" required />
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadAdvertisementForm;
