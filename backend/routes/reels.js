const express = require('express');
const router = express.Router();
const Reel = require('../models/Reel');

// Get all reels for an influencer
router.get('/influencer/:influencerId', async (req, res) => {
  try {
    const reels = await Reel.find({ influencerId: req.params.influencerId })
      .sort({ postDate: -1 })
      .populate('influencerId', 'name username');
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent reels (last 5) for an influencer
router.get('/influencer/:influencerId/recent', async (req, res) => {
  try {
    const reels = await Reel.find({ influencerId: req.params.influencerId })
      .sort({ postDate: -1 })
      .limit(5)
      .populate('influencerId', 'name username');
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reel by ID
router.get('/:id', async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id).populate('influencerId');
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }
    res.json(reel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new reel
router.post('/', async (req, res) => {
  try {
    const reel = new Reel(req.body);
    const savedReel = await reel.save();
    res.status(201).json(savedReel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get reels analytics for an influencer
router.get('/influencer/:influencerId/analytics', async (req, res) => {
  try {
    const reels = await Reel.find({ influencerId: req.params.influencerId });
    
    // Analyze tags and events
    const tagCount = {};
    const eventCount = {};
    const vibeCount = {};
    
    reels.forEach(reel => {
      if (reel.analysis.tags) {
        reel.analysis.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
      if (reel.analysis.events) {
        reel.analysis.events.forEach(event => {
          eventCount[event] = (eventCount[event] || 0) + 1;
        });
      }
      if (reel.analysis.vibe) {
        vibeCount[reel.analysis.vibe] = (vibeCount[reel.analysis.vibe] || 0) + 1;
      }
    });

    // Get top tags
    const topTags = Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Get top events
    const topEvents = Object.entries(eventCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }));

    // Get vibe distribution
    const vibeDistribution = Object.entries(vibeCount)
      .map(([vibe, count]) => ({ vibe, count, percentage: (count / reels.length * 100).toFixed(1) }));

    // Views trend
    const viewsTrend = reels
      .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
      .slice(0, 20)
      .map((reel, index) => ({
        reelNumber: index + 1,
        views: reel.views,
        likes: reel.likes,
        comments: reel.comments,
        date: reel.postDate
      }));

    res.json({
      totalReels: reels.length,
      totalViews: reels.reduce((sum, reel) => sum + reel.views, 0),
      averageViews: reels.length > 0 ? Math.round(reels.reduce((sum, reel) => sum + reel.views, 0) / reels.length) : 0,
      topTags,
      topEvents,
      vibeDistribution,
      viewsTrend
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;