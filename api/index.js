// Serverless API handler for Vercel
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Adjust path to import from backend
const taskRoutes = require('../backend/src/routes/taskRoutes');
const linkedInPostRoutes = require('../backend/src/routes/linkedInPostRoutes');
const weeklyGoalRoutes = require('../backend/src/routes/weeklyGoalRoutes');
const dailyGoalRoutes = require('../backend/src/routes/dailyGoalRoutes');

// Initialize express
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection cache for serverless environment
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  
  try {
    const client = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedDb = client;
    console.log('MongoDB connected successfully');
    return cachedDb;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Define routes
app.use('/api/tasks', taskRoutes);
app.use('/api/linkedin-posts', linkedInPostRoutes);
app.use('/api/weekly-goals', weeklyGoalRoutes);
app.use('/api/daily-goals', dailyGoalRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'CEO Assistant API is running...' });
});

// Serverless handler
module.exports = async (req, res) => {
  // Connect to database before handling the request
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}; 