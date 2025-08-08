import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

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
    const userId = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:5000/api/auth/update/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
      // Update localStorage
      localStorage.setItem('name', formData.name);
      localStorage.setItem('email', formData.email);
      alert('Profile updated successfully!');
      }
      else {
      alert('Update failed, try again.');
    }

    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
