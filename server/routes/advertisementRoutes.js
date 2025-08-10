const express = require('express');
const router = express.Router();
const { advertisementUpload } = require('../middleware/advertisementMiddleware');
const { verifyAdmin } = require('../middleware/authMiddleware');
const { createAdvertisement, getAllAdvertisements, deleteAdvertisement, getAdvertisementById } = require('../controllers/advertisementController');

// Setup multer

router.post('/', verifyAdmin, advertisementUpload.single('image'), createAdvertisement);
router.get('/', getAllAdvertisements);
router.get('/:id', getAdvertisementById);
router.delete('/:id', verifyAdmin, deleteAdvertisement);

module.exports = router;
