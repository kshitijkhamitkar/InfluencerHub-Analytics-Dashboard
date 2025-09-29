const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts for an influencer
router.get('/influencer/:influencerId', async (req, res) => {
  try {
    const posts = await Post.find({ influencerId: req.params.influencerId })
      .sort({ postDate: -1 })
      .populate('influencerId', 'name username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent posts (last 10) for an influencer
router.get('/influencer/:influencerId/recent', async (req, res) => {
  try {
    const posts = await Post.find({ influencerId: req.params.influencerId })
      .sort({ postDate: -1 })
      .limit(10)
      .populate('influencerId', 'name username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('influencerId');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new post
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get posts analytics for an influencer
router.get('/influencer/:influencerId/analytics', async (req, res) => {
  try {
    const posts = await Post.find({ influencerId: req.params.influencerId });
    
    // Analyze keywords
    const keywordCount = {};
    const vibeCount = {};
    
    posts.forEach(post => {
      if (post.analysis.keywords) {
        post.analysis.keywords.forEach(keyword => {
          keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
        });
      }
      if (post.analysis.vibe) {
        vibeCount[post.analysis.vibe] = (vibeCount[post.analysis.vibe] || 0) + 1;
      }
    });

    // Get top keywords
    const topKeywords = Object.entries(keywordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));

    // Get vibe distribution
    const vibeDistribution = Object.entries(vibeCount)
      .map(([vibe, count]) => ({ vibe, count, percentage: (count / posts.length * 100).toFixed(1) }));

    // Engagement trends (last 30 posts)
    const recentPosts = posts
      .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
      .slice(0, 30);

    const engagementTrend = recentPosts.map((post, index) => ({
      postNumber: recentPosts.length - index,
      likes: post.likes,
      comments: post.comments,
      engagement: post.likes + post.comments,
      date: post.postDate
    }));

    res.json({
      totalPosts: posts.length,
      topKeywords,
      vibeDistribution,
      engagementTrend,
      averageQuality: {
        visualAppeal: posts.length > 0 ? 
          (posts.reduce((sum, post) => sum + (post.analysis.quality?.visualAppeal || 0), 0) / posts.length).toFixed(1) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;