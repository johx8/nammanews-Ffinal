const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  redirectUrl: { type: String, required: false },
  contact: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Advertisement', advertisementSchema);
