const express = require('express');
const router = express.Router();
const Story = require('../models/storyModel');

router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.status(200).json(stories);
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
