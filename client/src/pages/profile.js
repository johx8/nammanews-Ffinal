import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('name') || '';
    const email = localStorage.getItem('email') || '';
    setFormData({ name, email });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    const userId = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        // Update localStorage
        localStorage.setItem('name', formData.name);
        localStorage.setItem('email', formData.email);
        setSuccess('✅ Profile updated successfully!');
      } else {
        setError('Update failed, try again.');
      }
    } catch (error) {
      setError('Failed to update profile.');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-gray-100 flex items-center justify-center px-3">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-8 py-10 animate-fadeIn">
        <h1 className="text-3xl font-extrabold mb-7 text-orange-700 text-center tracking-tight">
          My Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Name <span className="text-orange-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={saving}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 bg-gray-50 transition"
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Email <span className="text-orange-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={saving}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 bg-gray-50 transition"
              placeholder="you@email.com"
              autoComplete="email"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className={`w-full py-3 rounded-xl text-lg font-bold shadow-md transition bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 focus:ring-2 focus:ring-orange-400 focus:outline-none ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {(success || error) && (
            <div className={`mt-6 text-center text-base font-semibold rounded-xl py-2 px-4 ${
              success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {success || error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
