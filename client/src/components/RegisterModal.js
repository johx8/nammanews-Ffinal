// components/RegisterModal.js
import React, { useState } from 'react';
import axios from 'axios';

const RegisterModal = ({ eventId, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/events/${eventId}/register`, {
        name,
        email,
      });

      if (response.data.success) {
        alert('Registered successfully!');
        onClose();
      } else {
        alert(response.data.message || 'Failed to register');
      }
    } catch (err) {
      alert('Error registering for the event');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Register for Event</h2>
        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input mb-2"
        />
        <input
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mb-4"
        />
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
          Register
        </button>
        <button onClick={onClose} className="ml-4 text-red-500">Cancel</button>
      </div>
    </div>
  );
};

export default RegisterModal;
