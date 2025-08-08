const Video = require('../models/videoModel');

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
};
