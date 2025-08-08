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

// Optionally reject (delete) event
exports.rejectEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ success: true, message: 'Event rejected and deleted' });
  } catch (err) {
    console.error('Error rejecting event:', err);
    res.status(500).json({ success: false, message: 'Failed to reject event' });
  }
};


// POST /api/events/:id/register
exports.registerForEvent = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const isFreeForAll = !event.maxAttendees;
    const isAlreadyRegistered = event.registeredUsers.some((user) => user.email === email);
    if (isAlreadyRegistered) {
      return res.status(400).json({ success: false, message: 'You are already registered' });
    }

    if (!isFreeForAll && event.registeredUsers.length >= event.maxAttendees) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    event.registeredUsers.push({ name, email });
    await event.save();

    res.json({ success: true, message: 'Registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Registration failed' });
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

