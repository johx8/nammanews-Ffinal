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

  // Fetch event info for context (optional, but user-friendly!)
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
      const res = await axios.post(`http://localhost:5000/api/events/${id}/register`, { name, email });
      if (res.data.success || res.data.message === 'Registered successfully') {
        setMessage('Registration successful!');
        setTimeout(() => navigate(`/event/${id}`), 1500); // Redirect to event details after 1.5s
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-2 text-orange-600">Register for:</h1>
      {event && (
        <>
          <h2 className="text-lg font-semibold mb-2">{event.title}</h2>
          <p className="text-sm text-gray-500 mb-4">{event.district} | {event.category}</p>
        </>
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="input mb-3"
          placeholder="Your Name"
          value={name}
          required
          onChange={e => setName(e.target.value)}
        />
        <input
          className="input mb-3"
          placeholder="Your Email"
          type="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-orange-600 text-white rounded px-6 py-2 hover:bg-orange-700"
          disabled={submitting}
        >
          {submitting ? 'Registering...' : 'Register'}
        </button>
        <Link to={`/event/${id}`} className="ml-4 text-orange-600">Cancel</Link>
      </form>
      {message && <div className="mt-4 text-center text-sm">{message}</div>}
    </div>
  );
};

export default EventRegister;
