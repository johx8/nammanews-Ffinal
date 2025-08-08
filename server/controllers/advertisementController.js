const Advertisement = require('../models/advertisementModel');
const path = require('path');
const fs = require('fs');

exports.createAdvertisement = async (req, res) => {
  try {
    const { title, description, redirectUrl, contact } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const newAd = new Advertisement({
      title,
      description,
      redirectUrl,
      contact,
      imageUrl: `/ads/${req.file.filename}`,
      postedAt: new Date()
    });

    await newAd.save();

    res.status(201).json({ message: 'Advertisement created successfully', ad: newAd });
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ message: 'Failed to create advertisement' });
  }
};

exports.getAllAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find().sort({ postedAt: -1 });
    res.status(200).json({ ads });
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ message: 'Failed to fetch advertisements' });
  }
};
