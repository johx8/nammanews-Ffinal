const Event = require('../models/eventModel');


exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      district,
      category,
      date,
      time,
      organizedBy,
      contact,
      address,
      maxAttendees,
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    const istDate = new Date(date);
    istDate.setHours(0, 0, 0, 0); 

    const newEvent = new Event({
      title,
      description,
      district,
      category,
      date: istDate,
      time,
      organizedBy,
      contact,
      address,
      maxAttendees,
      imageUrl: imagePath,
      approved: true, // Admin-created events are auto-approved
      createdBy: req.user.userId
    });

    await newEvent.save();

    res.status(201).json({ success: true, message: 'Event created successfully', event: newEvent });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ success: false, message: 'Failed to create event', error: err.message });
  }
};

const User = require('../models/user');
const Advertisement = require('../models/advertisementModel');


exports.getAdminStats = async (req, res) => {
  try {
    const [userCount, eventCount, adCount, storyCount] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Advertisement.countDocuments(),
      Story.countDocuments(),
    ]);

    const currentDate = new Date();

    res.status(200).json({
      success: true,
      userCount,
      eventCount,
      adCount,
      storyCount,
       currentDate: currentDate.toISOString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats',
      error: error.message,
    });
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to count users' });
  }
};

exports.getEventCount = async (req, res) => {
  try {
    const count = await Event.countDocuments({approved: true});
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to count events' });
  }
};

exports.getAdvertisementCount = async (req, res) => {
  try { 
    const count = await Advertisement.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to count events' });
  }
};

exports.getStoryCount = async (req, res) => {
  try{
    const count = await Story.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to count stories' });
  }
};

exports.getAllEvents = async (req, res) => {
  try{
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json({ success: true, events });
  }catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events', error: error.message });
  }
};

exports.deleteEvents = async (req, res) => {
  try{
      await Event.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event', error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // If new image uploaded
    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Ensure updatedAt is refreshed
    updatedData.updatedAt = new Date();

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: 'Failed to update event', error: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try{
     const users = await User.find().select('-password');
     res.status(200).json(users );
  }catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try{
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  }catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
 const { role } = req.body;
  const validRoles = ['user', 'admin', 'editor'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User role updated', user: updatedUser });
  } catch (err) {
    console.error('Failed to update role:', err);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};


const Video = require('../models/videoModel');

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, youtubeLink } = req.body;
    let videoUrl = null;

    if (req.file) {
      videoUrl = `/videos/${req.file.filename}`;
    }

    if (!videoUrl && !youtubeLink) {
      return res.status(400).json({
        success: false,
        message: 'Either a video file or YouTube link must be provided',
      });
    }

    const newVideo = new Video({
      title,
      description,
      videoUrl,
      youtubeLink,
      uploadedBy: req.user.userId,
    });

    await newVideo.save();
    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      video: newVideo,
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload video',
      error: error.message,
    });
  }
};


const Story = require('../models/storyModel');

exports.createStory = async (req, res) => {
  try {
    const { title, description, date, time, district, category, youtubeLink } = req.body;

    const story = new Story({
      title,
      description,
      imageUrl: req.file ? `/stories/${req.file.filename}` : null,
      youtubeLink,
      date,
      time,
      district,
      category
    });

    await story.save();
    res.status(201).json({ message: 'Story created successfully', story });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ message: 'Failed to create story' });
  }
};


