const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: { type: String, required: false },       // <== changed here
  youtubeLink: { type: String, required: false },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
