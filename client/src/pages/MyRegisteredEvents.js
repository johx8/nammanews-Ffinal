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
    <div className="min-h-screen bg-gray-50 py-10 px-3 flex justify-center items-start">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-extrabold mb-8 text-orange-700 text-center">
          My Registered Events
        </h2>
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
            You haven't registered for any events yet.
          </div>
        ) : (
          <div className="space-y-6">
            {events.map(event => (
              <div
                key={event._id}
                className="bg-white shadow-lg rounded-2xl p-6 animate-fadeIn border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Icon & Title */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-2xl text-orange-600 mr-1">🎟</span>
                  <div>
                    <div className="text-xl font-bold text-gray-900 mb-1">{event.title}</div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-1">
                      <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                        📍 {event.district}
                      </span>
                      {event.category && (
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-medium">
                          🏷 {event.category}
                        </span>
                      )}
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                        📅 {new Date(event.date).toLocaleDateString()}
                      </span>
                      {event.time && (
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                          🕒 {event.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Attendance status (if any, or remove if not needed) */}
                {/* <span className="text-green-600 font-semibold">Registered</span> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
