const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  youtubeLink: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  district: { type: String, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
