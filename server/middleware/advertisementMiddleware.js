const multer = require('multer');
const path = require('path');

const advertisementStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'ads/'); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `ad-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const advertisementUpload = multer({ storage: advertisementStorage, fileFilter });
module.exports = {advertisementUpload};