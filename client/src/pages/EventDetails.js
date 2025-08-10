import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/events/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => setEvent(null));
  }, [id]);

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        Loading...
      </div>
    );
  }

  const {
    title,
    description,
    date,
    time,
    category,
    district,
    address,
    imageUrl,
    contact,
    maxAttendees,
    registeredUsers = []
  } = event;

  const isFreeForAll = !maxAttendees;
  const isFull = !isFreeForAll && registeredUsers.length >= maxAttendees;

  return (
    <div className="bg-gray-50 min-h-screen pt-16 px-4 flex justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left/Main Content (2/3 Width) */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-lg p-8 flex flex-col">
          {/* Event Image */}
          <img
            src={
              imageUrl
                ? (imageUrl.startsWith("http")
                  ? imageUrl
                  : `http://localhost:5000${imageUrl}`)
                : "https://via.placeholder.com/800x400?text=No+Image"
            }
            alt={title}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>

          {/* Category */}
          <span className="inline-block mb-4 px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 font-semibold">
            {category} | {district}
          </span>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-gray-700">{description}</p>
          </div>
        </div>

        {/* Sidebar (1/3 Width) */}
        <div className="md:col-span-1 bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between h-fit min-h-[300px]">
          {/* Date & Time */}
          <div className="mb-5">
            <div className="text-sm text-gray-500 mb-1">Date & Time</div>
            <div className="text-lg font-bold text-gray-900">
              {date ? new Date(date).toLocaleDateString() : "--"}
              {time ? `, ${time}` : ""}
            </div>
          </div>

          

          {/* Address */}
          <div className="mb-3">
            <div className="font-semibold text-gray-700 mb-1">📫 Address</div>
            <div className="text-gray-600">{address}</div>
          </div>

          {event.organizedBy && (
    <div className="mb-2">
      <div className="font-semibold text-gray-700 mb-1">🧑‍💼 Organized By</div>
      <div className="text-gray-600">{event.organizedBy}</div>
    </div>
  )}

          {/* Contact */}
          <div className="mb-5">
            <div className="font-semibold text-gray-700 mb-1">📞 Contact</div>
            <div className="text-gray-600">{contact}</div>
          </div>

          {/* Attendance Info */}
          <div className="mb-5 text-sm text-gray-700">
            {isFreeForAll
              ? "✅ Free for All"
              : isFull
              ? "❌ Event Full"
              : `✅ ${registeredUsers.length}/${maxAttendees} Attendees`}
          </div>

          {/* Registration Button */}
          {!isFull && (
            <button
              onClick={() => navigate(`/event/${id}/register`)}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg shadow hover:bg-orange-700 font-semibold transition mb-4"
            >
              Register Now
            </button>
          )}

          
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
