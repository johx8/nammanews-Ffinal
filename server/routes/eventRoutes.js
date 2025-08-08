const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const User = require('../models/user');
const { registerForEvent } = require('../controllers/adminEventController');



router.post('/:eventId/register', async (req, res) => {
  const { eventId } = req.params;
  const { name, email } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if slots are limited and already full
    if (event.maxAttendees && event.registeredUsers.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Registration full' });
    }

    event.registeredUsers.push({ name, email });
    await event.save();

    res.status(200).json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
});




router.get('/date/:date', async (req, res) => {
  try {
    const dateParam = req.params.date; // e.g., "2025-07-10"
    const [year, month, day] = dateParam.split('-').map(Number);

    // Create JS Date object at midnight IST (not UTC!)
    // Because new Date('YYYY-MM-DD') is always UTC
    const midnightIST = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    // Remove UTC offset to get local IST
    midnightIST.setHours(midnightIST.getHours() + 5, midnightIST.getMinutes() + 30);

    // Start and end of day in IST
    const startIST = new Date(midnightIST);
    const endIST = new Date(midnightIST);
    endIST.setHours(23,59,59,999);

    // Convert IST to UTC for MongoDB
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const startUTC = new Date(startIST.getTime() - istOffsetMs);
    const endUTC = new Date(endIST.getTime() - istOffsetMs);

    const events = await Event.find({
      date: {
        $gte: startUTC,
        $lte: endUTC,
      },
      approved: true,
    });

    res.status(200).json({ events });
  } catch (err) {
    console.error('Error fetching events by date:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});


router.post('/:id/register', registerForEvent);

module.exports = router;