import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EventRegister = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  // Registration fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => setEvent(null));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/events/${id}/register`, { name, email },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.data.success || res.data.message === 'Registered successfully') {
        setMessage('Registration successful!');
        setTimeout(() => navigate(`/event/${id}`), 1500);
      } else {
        setMessage(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setMessage((err.response?.data?.message) || 'Error registering for event');
    }
    setSubmitting(false);
  };

  if (event === null) return <div className="p-6 text-center">Loading event details...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
      <div className="w-full max-w-xl mx-auto rounded-3xl bg-white shadow-2xl p-8 sm:p-10 animate-fadeIn">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-orange-600 mb-2 tracking-tight">Register for Event</h1>
          {event && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h2>
              <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-semibold">{event.district}</span>
                <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-semibold">{event.category}</span>
              </div>
            </>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              id="name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 shadow-sm outline-none focus:ring-2 focus:ring-orange-100 transition text-gray-800 text-base bg-gray-50"
              placeholder="Your Name"
              value={name}
              required
              autoComplete="name"
              onChange={e => setName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 shadow-sm outline-none focus:ring-2 focus:ring-orange-100 transition text-gray-800 text-base bg-gray-50"
              placeholder="you@email.com"
              value={email}
              required
              autoComplete="email"
              onChange={e => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg shadow-md flex items-center justify-center"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
          <Link
            to={`/event/${id}`}
            className="block text-center mt-2 text-orange-600 hover:underline transition"
            tabIndex={submitting ? -1 : 0}
          >
            Cancel
          </Link>
        </form>
        {message && (
          <div className={`mt-6 text-center text-base font-medium rounded-xl py-2 px-4 ${
            message.toLowerCase().includes("success")
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegister;
