import React, { useState } from 'react';
import axios from 'axios';

const UploadAdvertisementForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    redirectUrl: '',
    contact: '',
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const { name, value } = e.target;

  // Allow only digits and max length 10
  if (name === 'contact') {
    const digitsOnly = value.replace(/\D/g, ''); // Remove non-digits
    if (digitsOnly.length <= 10) {
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    }
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
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
