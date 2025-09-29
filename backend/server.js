const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve static uploads

// =======================
// Database connection
// =======================
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/influencer_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // exit process if DB connection fails
  });

// =======================
// Routes
// =======================
try {
  app.use('/api/influencers', require('./routes/influencer'));
  app.use('/api/posts', require('./routes/posts'));
  app.use('/api/reels', require('./routes/reels'));
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
}

// =======================
// Health check endpoint
// =======================
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Server is running!' });
});

// =======================
// Start server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
