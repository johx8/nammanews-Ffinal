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

