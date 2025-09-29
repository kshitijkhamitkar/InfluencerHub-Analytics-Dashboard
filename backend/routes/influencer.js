const express = require('express');
const router = express.Router();
const Influencer = require('../models/Influencer');
const Post = require('../models/Post');
const Reel = require('../models/Reel');

// Get all influencers
router.get('/', async (req, res) => {
  try {
    const influencers = await Influencer.find().select('-__v');
    res.json(influencers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get influencer by ID
router.get('/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json(influencer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get influencer by username
router.get('/username/:username', async (req, res) => {
  try {
    const influencer = await Influencer.findOne({ username: req.params.username });
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json(influencer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get influencer analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }

    // Get posts and reels for analytics
    const posts = await Post.find({ influencerId: req.params.id });
    const reels = await Reel.find({ influencerId: req.params.id });

    // Calculate engagement metrics
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
    const totalReelViews = reels.reduce((sum, reel) => sum + reel.views, 0);

    const analytics = {
      totalPosts,
      totalReels: reels.length,
      averageLikes: totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0,
      averageComments: totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0,
      engagementRate: influencer.followers > 0 ? 
        parseFloat(((totalLikes + totalComments) / (totalPosts * influencer.followers) * 100).toFixed(2)) : 0,
      totalReelViews,
      demographics: influencer.demographics
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new influencer
router.post('/', async (req, res) => {
  try {
    const influencer = new Influencer(req.body);
    const savedInfluencer = await influencer.save();
    res.status(201).json(savedInfluencer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;