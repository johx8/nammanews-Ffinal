// eventController.js
const Event = require('../models/eventModel');

// Public route: Get only approved events for homepage
exports.getApprovedEvents = async (req, res) => {
  try {
    const query = { approved: true };
    if (req.query.district) query.district = req.query.district;
    if (req.query.category) query.category = req.query.category;
    const events = await Event.find(query).sort({ date: 1 });
    res.status(200).json({ success: true, events });
    // console.log("getApprovedEvents hit")
  } catch (err) {
    console.error('Error fetching approved events:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};
