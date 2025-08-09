const Event = require('../models/eventModel');
const mongoose = require('mongoose');
const {Parser} = require('json2csv'); // for CSV export

// Submit a new event (user submission)
exports.submitUserEvent = async (req, res) => {
  try {
    // Collect all possible fields from form-data
    const {
      title,
      description,
      date,
      time,
      district,
      category,
      organizedBy,
      contact,
      address,
      maxAttendees
    } = req.body;

    // Parse numbers/empty input for maxAttendees
    const maxAttendeesParsed = maxAttendees ? Number(maxAttendees) : null;

    // Image file handling (multer should populate req.file)
    let imageUrl = '';
    if (req.file && req.file.filename) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Defensive check for required fields (improve as needed)
    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !district ||
      !category ||
      !organizedBy ||
      !contact ||
      !address
    ) {
      return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    // Always set approved: false for user submissions!
    const event = new Event({
      title,
      description,
      date,
      time,
      district,
      category,
      organizedBy,
      contact,
      address,
      maxAttendees: maxAttendeesParsed,
      imageUrl,
      approved: false,
      createdBy: req.user.userId,
    });

    await event.save();

    return res.status(201).json({ success: true, message: "Event submitted for approval", event });
  } catch (err) {
    console.error("Error submitting user event:", err);
    return res.status(500).json({ success: false, message: "Failed to submit event" });
  }
};


// Get all events created by the logged-in user
exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "No user id" });
    }

    const events = await Event.find({ createdBy: userId })
      .sort({ date: -1 })
      .select('-__v');

    return res.status(200).json({ success: true, events });
  } catch (err) {
    console.error('Error fetching user events:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user events',
      error: err.message
    });
  }
};

exports.getEventAttendeesForUser = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;

    // Ensure event belongs to this user and is approved
    const event = await Event.findOne({
      _id: id,
      createdBy: userId,
      approved: true
    }).select('title registeredUsers');

    if (!event) {
      return res.status(403).json({
        success: false,
        message: 'Event not found or not approved'
      });
    }

    const attendees = event.registeredUsers || [];

    // CSV export
    if (req.query.format === 'csv') {
      const { Parser } = require('json2csv');
      const fields = ['name', 'email', 'registeredAt'];
      const json2csv = new Parser({ fields });
      const csv = json2csv.parse(attendees);

      res.header('Content-Type', 'text/csv');
      res.attachment(`${event.title.replace(/\s+/g, '_')}-attendees.csv`);
      return res.send(csv);
    }

    // JSON export
    return res.status(200).json({
      success: true,
      title: event.title,
      attendees
    });
  } catch (err) {
    console.error('Error fetching attendees:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// controllers/eventController.js
exports.getEventsUserRegisteredFor = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id // from your auth middleware
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User id missing' });
    }

    // Find all events where this userId exists in registeredUsers
    const events = await Event.find({ 
      'registeredUsers.userId': userId 
    }).select('-__v');
    console.log('Registered events:', events);
    return res.status(200).json({ success: true, events });
  } catch (err) {
    console.error('Error fetching registered events:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

