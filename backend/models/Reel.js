const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  influencerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer',
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  analysis: {
    events: [{
      type: String
    }],
    objects: [{
      type: String
    }],
    vibe: {
      type: String,
      enum: ['party', 'travel luxury', 'casual daily life', 'workout', 'cooking', 'dance']
    },
    tags: [{
      type: String
    }],
    setting: {
      type: String,
      enum: ['indoor', 'outdoor', 'studio', 'travel', 'home']
    }
  },
  duration: {
    type: Number, // in seconds
    default: 30
  },
  postDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reel', reelSchema);