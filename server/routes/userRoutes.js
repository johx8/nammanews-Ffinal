const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyUser } = require('../middleware/authMiddleware');
const { submitUserEvent, getUserEvents, getEventAttendeesForUser, getEventsUserRegisteredFor } = require('../controllers/userEventController');


router.post('/events', verifyUser, upload.single('image'), submitUserEvent);

router.get('/my-events', verifyUser, getUserEvents);

router.get('/events/:id', verifyUser, getUserEvents);
// router.get('/my-events/:id/download', verifyUser, getUserEvents);
router.get('/my-events/:id/attendees', verifyUser, getEventAttendeesForUser);

router.get('/my-registrations', verifyUser, getEventsUserRegisteredFor);

module.exports = router;
