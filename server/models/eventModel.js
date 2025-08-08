const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  organizedBy: { type: String, required: true },
  imageUrl: { type: String },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  category: { type: String, required: true },
  maxAttendees: { type: Number }, // If not set, treated as free-for-all
  registeredUsers: [
    {
      name: String,
      email: String,
      registeredAt: { type: Date, default: Date.now }
    }
  ],
  approved: { type: Boolean, default: null }, // <--- add this!
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // <--- add this!
  rejectionMessage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
