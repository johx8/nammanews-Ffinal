const multer = require('multer');
const path = require('path');

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos/'); // Make sure this folder exists!
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const videoFileFilter = (req, file, cb) => {
  const allowed = ['.mp4', '.mov', '.avi'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const uploadVideo = multer({ storage: videoStorage, fileFilter: videoFileFilter });

module.exports = { uploadVideo };
