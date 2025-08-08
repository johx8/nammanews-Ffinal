import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const fetchEventsByDate = async (date) => {
    
    try {
      const formattedDate = date.toISOString().split('T')[0]; // e.g. "2025-06-27"
      console.log('Fetching events for:', formattedDate);
      const response = await axios.get(`http://localhost:5000/api/events/date/${formattedDate}`);
      setEvents(response.data.events || []);
      
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };
  

  useEffect(() => {
    fetchEventsByDate(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">📅 Event Calendar</h2>
      
      <Calendar onChange={handleDateChange} value={selectedDate} className="mb-6" />

      <h3 className="text-lg font-semibold mb-2 text-gray-700">
        Events on {selectedDate.toDateString()}:
      </h3>

      {events.length > 0 ? (
        <ul className="list-disc list-inside text-sm text-gray-800">
          {events.map((event, index) => (
            <li key={index}>
              <strong>{event.title}</strong> – {event.time} in {event.district}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No events on this day.</p>
      )}
    </div>
  );
};

export default CalendarPage;
