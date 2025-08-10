const express = require('express');
const router = express.Router();
const eventController = require('../controllers/EventController');

// ✅ Only fetch approved events
router.get('/', eventController.getApprovedEvents);

module.exports = router;
