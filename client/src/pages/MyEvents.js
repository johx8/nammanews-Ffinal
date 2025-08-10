import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/user/my-events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEvents(res.data.events);
      } catch (err) {
        console.error("Error fetching user events:", err);
        setError('Failed to fetch your events.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  const downloadAttendees = async (eventId, title) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/user/my-events/${eventId}/attendees?format=csv`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}-attendees.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading attendees:", err);
      alert("Failed to download attendees list.");
    }
  };

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center text-lg text-gray-400">
      Loading...
    </div>
  );
  if (error) return (
    <div className="min-h-[50vh] flex items-center justify-center text-lg text-red-500 font-semibold">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-3">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-orange-700 text-center">My Submitted Events</h2>
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
            You haven’t submitted any events yet.
          </div>
        ) : (
          <div className="space-y-6">
            {events.map(event => (
              <div key={event._id} className="bg-white shadow-lg rounded-2xl p-6 animate-fadeIn border border-gray-100">
                <div className="flex flex-wrap items-center justify-between mb-1">
                  <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                  {/* Event status badge */}
                  <span
                    className={`px-4 py-1 rounded-full font-semibold text-sm 
                      ${event.approved
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : event.rejectionMessage
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-orange-50 text-orange-700 border border-orange-200"
                    }`}
                  >
                    {event.approved
                      ? "Approved"
                      : event.rejectionMessage
                      ? "Rejected"
                      : "Pending Approval"}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{event.description}</p>
                <div className="flex flex-wrap gap-2 text-gray-500 text-sm mb-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                    📍 {event.district}
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                    📅 {new Date(event.date).toLocaleDateString()}
                  </span>
                  {event.time && (
                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                      🕒 {event.time}
                    </span>
                  )}
                </div>
                {event.rejectionMessage && (
                  <div className="bg-red-50 text-red-700 px-4 py-2 mb-2 rounded-lg border border-red-200">
                    <span className="font-semibold">Rejection Reason:</span> {event.rejectionMessage}
                  </div>
                )}
                {event.approved && event.registeredUsers?.length > 0 && (
                  <button
                    onClick={() => downloadAttendees(event._id, event.title)}
                    className="mt-3 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition"
                  >
                    📥 Download Attendees ({event.registeredUsers.length})
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
