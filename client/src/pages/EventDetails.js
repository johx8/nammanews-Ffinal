import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetail = ({ onRegisterClick }) => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => setEvent(null));
  }, [id]);

  if (!event) return <p>Loading...</p>;

  // Early destructure with fallback
  const {
    title,
    description,
    date,
    time,
    organizedBy,
    district,
    category,
    address,
    imageUrl,
    maxAttendees,
    registeredUsers = [],
  } = event;

  const isFreeForAll = !maxAttendees;
  const isFull = !isFreeForAll && registeredUsers.length >= maxAttendees;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      {imageUrl && (
        <img
          src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`}
          alt={title}
          className="w-full h-96 object-cover mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-2 leading-snug text-gray-800">{title}</h1>
      <p className="text-md text-gray-600 mb-3 italic">
        {district} | {category} | {date ? new Date(date).toLocaleDateString() : ''} {time}
      </p>
      <p className="text-gray-800 text-base mb-4">{description}</p>
      <div className="flex flex-wrap gap-3 mb-4">
        <span className="px-3 py-1 rounded bg-orange-50 text-orange-800 text-xs font-medium">
          Organized by: {organizedBy}
        </span>
        <span className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
          Address: {address}
        </span>
      </div>
      <div className="mb-5">
        <span className="text-base">
          {isFreeForAll
            ? '✅ Free for All'
            : isFull
            ? '❌ Event Full'
            : `✅ ${registeredUsers.length}/${maxAttendees} Attendees`}
        </span>
      </div>
      {!isFull && (
        <button
          onClick={() => navigate(`/event/${id}/register`)}
          className="bg-orange-600 text-white font-semibold px-6 py-2 rounded hover:bg-orange-700 transition-all"
        >
          Register
        </button>
      )}
    </div>
  );
};

export default EventDetail;
