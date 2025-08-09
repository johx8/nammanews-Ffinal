const Event = require('../models/eventModel');

// Fetch all unapproved events
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ approved: false });
    res.status(200).json({ success: true, events });
  } catch (err) {
    console.error('Error fetching pending events:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch pending events' });
  }
};

// Approve event
exports.approveEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updatedEvent = await Event.findByIdAndUpdate(eventId, { approved: true }, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, message: 'Event approved successfully', event: updatedEvent });
  } catch (err) {
    console.error('Error approving event:', err);
    res.status(500).json({ success: false, message: 'Failed to approve event' });
  }
};


// POST /api/events/:id/register
const mongoose = require('mongoose');

// exports.registerForEvent = async (req, res) => {
//   const { id } = req.params;
//   const { name, email } = req.body;
//   const userId = req.user.userId; // still string from JWT

//   try {
//     const event = await Event.findById(id);
//     if (!event) {
//       return res.status(404).json({ success: false, message: 'Event not found' });
//     }

//     const isFreeForAll = !event.maxAttendees;

//     const isAlreadyRegistered = event.registeredUsers.some(
//       user => String(user.userId) === String(userId)
//     );
//     if (isAlreadyRegistered) {
//       return res.status(400).json({ success: false, message: 'You are already registered' });
//     }

//     if (!isFreeForAll && event.registeredUsers.length >= event.maxAttendees) {
//       return res.status(400).json({ success: false, message: 'Event is full' });
//     }

//     // Push with ObjectId
//     event.registeredUsers.push({
//       userId: userId,
//       name,
//       email,
//       registeredAt: new Date()
//     });

//     await event.save();

//     res.json({ success: true, message: 'Registered successfully' });
//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ success: false, message: 'Registration failed', error: err.message,stack: err.stack });
//   }
// };


// controllers/adminController.js
exports.rejectEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { message } = req.body;

    // Require a rejection message
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Rejection message is required.'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        approved: false,
        rejectionMessage: message.trim(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event rejected successfully.',
      event: updatedEvent
    });

  } catch (err) {
    console.error('Error rejecting event:', err);
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: err.message
    });
  }
};


exports.getEventAttendees = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).select('attendees title');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      title: event.title,
      attendees: event.attendees || [],
    });
  } catch (err) {
    console.error('Error fetching attendees:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Public: Fetch all approved events

