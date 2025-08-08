const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory to save uploaded files
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Use current timestamp as filename
  }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept image files
    }else {
        cb(new Error('Only image files are allowed!'), false); // Reject non-image files
    }   
};

const upload = multer({storage: storage, fileFilter});
module.exports = upload;