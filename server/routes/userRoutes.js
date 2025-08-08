const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyUser } = require('../middleware/authMiddleware');
const { submitUserEvent, getUserEvents } = require('../controllers/userEventController');


router.post('/events', verifyUser, upload.single('image'), submitUserEvent);

router.get('/my-events', verifyUser, getUserEvents);

module.exports = router;
