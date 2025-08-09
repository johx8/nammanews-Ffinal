const Advertisement = require('../models/advertisementModel');
const path = require('path');
const fs = require('fs');


exports.createAdvertisement = async (req, res) => {
  try {
    const { title, description, redirectUrl, contact, category, district  } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const newAd = new Advertisement({
      title,
      description,
      redirectUrl,
      contact,
      category,
      district,
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

exports.deleteAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    // Delete the image from the filesystem if stored locally
    if (ad.imageUrl && ad.imageUrl.includes("ads/")) {
      const imagePath = path.join(__dirname, "..", ad.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await ad.deleteOne();
    res.status(200).json({ message: "Advertisement deleted successfully" });
  } catch (err) {
    console.error("Error deleting advertisement:", err);
    res.status(500).json({ message: "Server error deleting advertisement" });
  }
};
