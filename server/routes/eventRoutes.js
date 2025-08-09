const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const User = require('../models/user');
const { registerForEvent } = require('../controllers/adminEventController');
// const {getMyEventAttendees} = require('../controllers/userEventController')
// const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const { verifyUser } = require('../middleware/authMiddleware');


router.post('/:eventId/register', verifyUser, async (req, res) => {
  const { eventId } = req.params;
  const { name, email } = req.body;
  const userId = req.user.userId; // from auth middleware

  try {
    // Validate userId presence and format
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing user ID' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const alreadyRegistered = event.registeredUsers.some(
      u => String(u.userId) === String(userId)
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Check if slots are full
    if (event.maxAttendees && event.registeredUsers.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Registration full' });
    }

    // Push valid registration
    event.registeredUsers.push({
      userId: userId, // Use ObjectId from req.user
      name: name || req.user.name,
      email: email || req.user.email,
      registeredAt: new Date()
    });
    await event.save();

    res.status(200).json({ message: 'Registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
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


// router.post('/:id/register', registerForEvent);
// routes/userEventRoutes.js
// router.get('/my-events/:id/attendees', authMiddleware, getMyEventAttendees);


module.exports = router;