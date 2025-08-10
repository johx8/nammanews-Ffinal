import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const districts = [
  "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar",
  "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag",
  "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara",
  "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgiri"
];

const categories = [
  "Business", "Dance", "Education", "Health", "Food", "Arts", "Workshop", "Finance", "Advertisements"
];

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [viewAttendees, setViewAttendees] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/events');
      const data = Array.isArray(res.data) ? res.data : res.data.events || [];
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/events/${id}`);
      setEvents(events.filter(event => event._id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEvent(prev => ({ ...prev, [name]: value }));
  };

  const updateEvent = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/events/${editEvent._id}`, editEvent);
      setEditEvent(null);
      fetchEvents();
    } catch (err) {
      console.error('Error updating event:', err);
    }
  };

  const downloadPDF = (attendees, title) => {
    const doc = new jsPDF();
    doc.text(`Attendees for ${title}`, 14, 15);
    const tableRows = attendees.map((att, index) => [
      index + 1,
      att.name,
      att.email,
      new Date(att.registeredAt).toLocaleString()
    ]);
    doc.autoTable({
      head: [['#', 'Name', 'Email', 'Registered At']],
      body: tableRows,
      startY: 20
    });
    doc.save(`${title}_attendees.pdf`);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-7 text-orange-700 tracking-tight text-center sm:text-left">
        Manage Events
      </h1>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-orange-50">
              <th className="p-4 font-semibold text-left text-gray-700">Title</th>
              <th className="p-4 font-semibold text-left text-gray-700">District</th>
              <th className="p-4 font-semibold text-left text-gray-700">Date</th>
              <th className="p-4 font-semibold text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr key={event._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-4 text-gray-800 font-medium">{event.title}</td>
                <td className="p-4 text-gray-700">{event.district}</td>
                <td className="p-4 text-gray-700">{new Date(event.date).toLocaleDateString()}</td>
                <td className="p-4 whitespace-nowrap flex flex-wrap gap-2">
                  <button
                    onClick={() => setEditEvent(event)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg focus:ring-2 focus:ring-blue-300 font-semibold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg focus:ring-2 focus:ring-red-300 font-semibold transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setViewAttendees(event)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg focus:ring-2 focus:ring-green-300 font-semibold transition"
                  >
                    Attendees
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">No events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Event Modal */}
      {editEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white px-7 py-8 rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn">
            <h2 className="text-2xl font-extrabold mb-6 text-orange-700">Edit Event</h2>
            <form onSubmit={e => { e.preventDefault(); updateEvent(); }}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editEvent.title}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Event Title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editEvent.description}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none min-h-[120px] resize-y"
                  placeholder="Event Description"
                  required
                  rows={5}
                  style={{ minHeight: 100 }}
                />
              </div>
              <div className="mb-4 flex gap-3">
                <div className="flex-1">
                  <label className="block mb-1 font-semibold text-gray-700">Category</label>
                  <select
                    name="category"
                    value={editEvent.category}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-semibold text-gray-700">District</label>
                  <select
                    name="district"
                    value={editEvent.district}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-7">
                <label className="block mb-1 font-semibold text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editEvent.date?.substring(0, 10)}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditEvent(null)}
                  className="px-5 py-2 font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 shadow-md transition"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendee Modal */}
      {viewAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-7 rounded-2xl shadow-2xl w-[98%] max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <h2 className="text-xl font-extrabold mb-4 text-orange-700">Attendees for: {viewAttendees.title}</h2>
            {viewAttendees.registeredUsers?.length > 0 ? (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
                  <table className="min-w-full divide-y divide-gray-100 text-sm">
                    <thead>
                      <tr className="bg-orange-50">
                        <th className="p-2 font-semibold">#</th>
                        <th className="p-2 font-semibold">Name</th>
                        <th className="p-2 font-semibold">Email</th>
                        <th className="p-2 font-semibold">Registered At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewAttendees.registeredUsers.map((user, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-2">{idx + 1}</td>
                          <td className="p-2">{user.name}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">{new Date(user.registeredAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => downloadPDF(viewAttendees.registeredUsers, viewAttendees.title)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Download PDF
                </button>
              </>
            ) : (
              <p className="text-gray-600">No attendees have registered yet.</p>
            )}
            <div className="mt-6 text-right">
              <button
                onClick={() => setViewAttendees(null)}
                className="text-red-600 font-semibold hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
