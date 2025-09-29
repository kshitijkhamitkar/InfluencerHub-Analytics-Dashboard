const mongoose = require('mongoose');

const demographicsSchema = new mongoose.Schema({
  gender: {
    male: { type: Number, default: 0 },
    female: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  ageGroups: {
    '18-24': { type: Number, default: 0 },
    '25-34': { type: Number, default: 0 },
    '35-44': { type: Number, default: 0 },
    '45-54': { type: Number, default: 0 },
    '55+': { type: Number, default: 0 }
  },
  geography: [{
    country: String,
    percentage: Number
  }]
});

const influencerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String,
    required: true
  },
  followers: {
    type: Number,
    required: true
  },
  following: {
    type: Number,
    required: true
  },
  postsCount: {
    type: Number,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: false
  },
  engagement: {
    averageLikes: { type: Number, default: 0 },
    averageComments: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 }
  },
  demographics: demographicsSchema,
  category: {
    type: String,
    enum: ['Fashion', 'Travel', 'Food', 'Lifestyle', 'Tech', 'Fitness', 'Beauty'],
    default: 'Lifestyle'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Influencer', influencerSchema);