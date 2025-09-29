const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


// CORS Configuration

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now, restrict in production
    }
  },
  credentials: true
}));


// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


// Database Connection

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/influencer_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


// Routes

try {
  app.use('/api/influencers', require('./routes/influencer'));
  app.use('/api/posts', require('./routes/posts'));
  app.use('/api/reels', require('./routes/reels'));
} catch (err) {
  console.error('Error loading routes:', err.message);
  process.exit(1);
}


// Root Endpoint

app.get('/', (req, res) => {
  res.json({
    message: 'Influencer Hub API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      influencers: '/api/influencers',
      posts: '/api/posts',
      reels: '/api/reels'
    }
  });
});


// Health Check Endpoint

app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});


// 404 Handler

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});


// Error Handler

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});


// Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Access at: http://localhost:${PORT}`);
});


// Graceful Shutdown

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  mongoose.connection.close();
  process.exit(0);
});