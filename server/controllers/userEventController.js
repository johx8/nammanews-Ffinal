const Event = require('../models/eventModel');
const mongoose = require('mongoose');

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
    // Only fetch events created by the specific user
    const events = await Event.find({ createdBy: userId }).sort({ date: -1 });
    return res.status(200).json({ success: true, events });
  } catch (err) {
    console.error('Error fetching user events:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user events' });
  }
};
