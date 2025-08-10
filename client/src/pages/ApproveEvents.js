import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApproveEvents = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [rejectionMessages, setRejectionMessages] = useState({});

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/pending-events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingEvents(res.data.events);
    } catch (err) {
      console.error('Error fetching pending events:', err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/approve-event/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPending();
    } catch (err) {
      console.error('Error approving event:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const message = rejectionMessages[id] || '';
      await axios.put(`http://localhost:5000/api/admin/reject-event/${id}`, {message}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRejectionMessages((prev) => {
        const newState = {...prev}; delete newState[id]; return newState;
      });
      fetchPending();
    } catch (err) {
      console.error('Error rejecting event:', err);
    }
  };

  const handleMessageChange = (id, value) => {
    setRejectionMessages((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-orange-700 tracking-tight text-center">
        Pending Event Approvals
      </h2>
      {pendingEvents.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-md text-gray-500 text-center max-w-lg mx-auto mt-10">
          No pending events.
        </div>
      ) : (
        <div className="grid gap-7 max-w-3xl mx-auto">
          {pendingEvents.map(event => (
            <div key={event._id} className="bg-white rounded-2xl shadow-md px-6 py-6 animate-fadeIn">
              <div className="mb-2 flex flex-wrap gap-2 items-center">
                <span className="text-orange-600 font-bold text-lg">{event.title}</span>
                <span className="ml-2 px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-semibold">{event.category}</span>
                <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold">{event.district}</span>
              </div>
              <p className="text-gray-800 mb-3 text-base">{event.description}</p>
              <div className="flex flex-wrap gap-6 mb-4 text-gray-500 text-sm">
                <div>📅 {event.date && new Date(event.date).toLocaleDateString()}</div>
                <div>⏰ {event.time}</div>
              </div>
              {/* Rejection Message Box */}
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-gray-800 text-base bg-gray-50"
                placeholder="Enter rejection message (optional)"
                value={rejectionMessages[event._id] || ''}
                onChange={(e) => handleMessageChange(event._id, e.target.value)}
                rows={2}
              />
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => handleApprove(event._id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold shadow-md transition focus:ring-2 focus:ring-green-200"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(event._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold shadow-md transition focus:ring-2 focus:ring-red-200"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveEvents;
