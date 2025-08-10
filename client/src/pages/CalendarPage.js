import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEventsByDate = async (date) => {
    try {
      setLoading(true);
      const formattedDate = date.toLocaleDateString('en-CA');
      const response = await axios.get(
        `http://localhost:5000/api/events/date/${formattedDate}`
      );
      setEvents(response.data.events || []);
    } catch (err) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsByDate(selectedDate);
    // eslint-disable-next-line
  }, [selectedDate]);

  return (
    <Box
      className="max-w-4xl mx-auto mt-8"
      sx={{
        bgcolor: 'white',
        boxShadow: 4,
        borderRadius: 3,
        p: { xs: 2, md: 4 },
        mb: 6,
      }}
    >
      <Typography variant="h4" fontWeight={900} mb={2} color="orange">
        📅 Event Calendar
      </Typography>

      {/* MUI Date Calendar */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{
          display: 'flex',
          justifyContent: { xs: "center", md: "start" },
          mb: 5
        }}>
          <DateCalendar
            value={selectedDate}
            onChange={setSelectedDate}
            sx={{
              bgcolor: '#fff',
              borderRadius: 2,
              boxShadow: 2,
              "--mui-palette-primary-main": "#fb923c", // orange accent
              "& .MuiPickersDay-root.Mui-selected": {
                bgcolor: "#fb923c",
                color: "#fff",
              },
              "& .MuiPickersDay-root:hover": {
                bgcolor: "#fde68a",
              },
              "& .MuiPickersDay-root.Mui-selected:hover": {
                bgcolor: "#f97316",
              },
              "& .MuiTypography-root": {
                fontWeight: 700,
                color: "#fb923c"
              },
            }}
            views={['day', 'month', 'year']}
            showDaysOutsideCurrentMonth
            disablePast={false}
          />
        </Box>
      </LocalizationProvider>

      {/* Selected date heading */}
      <Typography variant="h6" fontWeight={700} mb={2} color="gray.700">
        Events on {selectedDate.toDateString()}:
      </Typography>

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
          <CircularProgress size={20} color="warning" />
          <Typography color="gray" fontSize={14}>Loading events...</Typography>
        </Box>
      )}

      {/* Event List */}
      {!loading && events.length > 0 ? (
        <Box as="ul" sx={{ p: 0, m: 0 }}>
          {events.map((event, idx) => (
            <Paper
              component="li"
              elevation={2}
              key={event._id || idx}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "12px",
                bgcolor: "#fff7ed",
                borderLeft: "4px solid #fb923c"
              }}
            >
              <Typography fontWeight={800} color="orange" fontSize={18}>
                {event.title}
              </Typography>
              <Box sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
                🕒 {event.time} &nbsp; | &nbsp; 📍 {event.district} &nbsp; | &nbsp; 🎯 {event.category}
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        !loading && (
          <Typography color="gray" fontSize={15} mt={2}>
            No events on this day.
          </Typography>
        )
      )}
    </Box>
  );
}
