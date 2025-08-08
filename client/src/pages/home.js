import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all events from your backend
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        // Accepts {success, events} or directly events []
        let data = [];
        if (Array.isArray(res.data.events)) {
          data = res.data.events;
        } else if (Array.isArray(res.data)) {
          data = res.data;
        }
        setEvents(data);
        console.log("Fetched events:", data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-orange-700">Discover Local Events</h1>
      <p className="mb-6 text-gray-600">Stay updated on what's happening around you.</p>

      {loading ? (
        <div className="text-center mt-6 text-gray-600">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="mt-8 text-gray-500 text-lg">No events available yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              to={`/event/${event._id}`}
              key={event._id}
              className="block"
            >
              <div className="bg-white rounded shadow hover:shadow-lg transition overflow-hidden h-80 flex flex-col">
                <img
                  src={
                    event.imageUrl
                      ? event.imageUrl.startsWith('http')
                        ? event.imageUrl
                        : `http://localhost:5000${event.imageUrl}`
                      : 'https://via.placeholder.com/400x200?text=No+Image'
                  }
                  alt={event.title}
                  className="w-full h-40 object-cover"
                  style={{ background: "#ececec" }}
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-orange-600 truncate">
                      {event.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.district || 'No district'} | {event.category}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : ''}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
