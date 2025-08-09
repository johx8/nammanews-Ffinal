// src/pages/user/MyEvents.js
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

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4">
      <h2 className="text-2xl font-bold mb-4">My Submitted Events</h2>
      {events.length === 0 ? (
        <p className="text-gray-600">You haven’t submitted any events yet.</p>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event._id} className="border p-4 rounded shadow-sm bg-white">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-700">{event.description}</p>
              <p className="text-sm text-gray-500">
                📍 {event.district} | 📅 {new Date(event.date).toLocaleDateString()} | 🕒 {event.time}
              </p>
              <p
                className={`mt-2 font-semibold ${
                  event.approved
                    ? 'text-green-600'
                    : event.rejectionMessage
                    ? 'text-red-600'
                    : 'text-orange-600'
                }`}
              >
                {event.approved
                  ? 'Approved'
                  : event.rejectionMessage
                  ? `Rejected: ${event.rejectionMessage}`
                  : 'Pending Approval'}
              </p>

              {event.approved && event.registeredUsers?.length > 0 && (
                <button
                  onClick={() => downloadAttendees(event._id, event.title)}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  📥 Download Attendees
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
