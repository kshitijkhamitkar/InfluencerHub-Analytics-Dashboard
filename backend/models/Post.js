const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  influencerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  analysis: {
    keywords: [{
      type: String
    }],
    vibe: {
      type: String,
      enum: ['casual', 'aesthetic', 'luxury', 'energetic', 'professional', 'playful']
    },
    quality: {
      lighting: {
        type: String,
        enum: ['excellent', 'good', 'average', 'poor']
      },
      visualAppeal: {
        type: Number,
        min: 1,
        max: 10
      },
      consistency: {
        type: String,
        enum: ['high', 'medium', 'low']
      }
    }
  },
  postDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);