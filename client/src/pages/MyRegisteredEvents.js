import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyRegisteredEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/user/my-registrations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data.events || []);
      } catch (err) {
        console.error('Error fetching registered events:', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>My Registered Events</h2>
      {events.length === 0 ? (
        <p>You haven't registered for any events yet.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event._id}>
              <strong>{event.title}</strong> — {new Date(event.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
