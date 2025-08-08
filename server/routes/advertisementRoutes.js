const express = require('express');
const router = express.Router();
const { advertisementUpload } = require('../middleware/advertisementMiddleware');

const { createAdvertisement, getAllAdvertisements } = require('../controllers/advertisementController');

// Setup multer

router.post('/', advertisementUpload.single('image'), createAdvertisement);
router.get('/', getAllAdvertisements);

module.exports = router;
