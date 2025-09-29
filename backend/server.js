const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ============================================
// ENVIRONMENT VARIABLE VALIDATION
// ============================================
const requiredEnvVars = ['MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please set these in your Render dashboard under Environment settings');
  process.exit(1);
}

// Log environment status (without exposing sensitive data)
console.log('✅ Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- PORT:', process.env.PORT || 5000);
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Missing');
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set (will allow all origins)');

// ============================================
// CORS CONFIGURATION - FIXED FOR PRODUCTION
// ============================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
  process.env.FRONTEND_URL
].filter(Boolean);

console.log('🌐 Allowed CORS Origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // In production, strictly check allowed origins
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn('⚠️  Blocked CORS request from unauthorized origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow all origins
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (helps debug deployment issues)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// DATABASE CONNECTION WITH RETRY LOGIC
// ============================================
const MONGO_URI = process.env.MONGODB_URI;
const MAX_RETRIES = 5;
let retryCount = 0;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.name);
    retryCount = 0; // Reset retry count on success
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`🔄 Retrying connection (${retryCount}/${MAX_RETRIES}) in 5 seconds...`);
      setTimeout(connectDB, 5000);
    } else {
      console.error('💀 Max retries reached. Exiting...');
      process.exit(1);
    }
  }
};

connectDB();

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// ============================================
// ROUTES WITH ERROR HANDLING
// ============================================
try {
  const influencerRoutes = require('./routes/influencer');
  const postsRoutes = require('./routes/posts');
  const reelsRoutes = require('./routes/reels');
  
  app.use('/api/influencers', influencerRoutes);
  app.use('/api/posts', postsRoutes);
  app.use('/api/reels', reelsRoutes);
  
  console.log('✅ Routes loaded successfully');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
}

// ============================================
// ROOT ENDPOINT
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'Influencer Hub API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      influencers: '/api/influencers',
      posts: '/api/posts',
      reels: '/api/reels'
    }
  });
});

// ============================================
// HEALTH CHECK ENDPOINT (Critical for Render)
// ============================================
app.get('/api/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      name: mongoose.connection.name || 'unknown'
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  };
  
  // Return 503 if database is not connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      ...healthCheck,
      status: 'unhealthy',
      error: 'Database not connected'
    });
  }
  
  res.json(healthCheck);
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  console.warn('⚠️  404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    message: 'The requested endpoint does not exist',
    availableEndpoints: [
      '/api/health',
      '/api/influencers',
      '/api/posts',
      '/api/reels'
    ]
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'The provided ID is not valid'
    });
  }
  
  // Generic error response
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack,
      path: req.path 
    })
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Local access: http://localhost:${PORT}`);
  console.log('🚀 ================================');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} signal received: closing HTTP server`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});