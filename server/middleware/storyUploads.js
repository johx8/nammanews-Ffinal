const multer = require('multer');
const path = require('path');

const storyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'stories/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept image files
    }else {
        cb(new Error('Only image files are allowed!'), false); // Reject non-image files
    }   
};

const storyUpload = multer({ storage: storyStorage, fileFilter });

module.exports = {storyUpload};
