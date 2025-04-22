// Serverless API handler for Vercel
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Adjust path to import from backend
const taskRoutes = require('../backend/src/routes/taskRoutes');
const linkedInPostRoutes = require('../backend/src/routes/linkedInPostRoutes');
const weeklyGoalRoutes = require('../backend/src/routes/weeklyGoalRoutes');
const dailyGoalRoutes = require('../backend/src/routes/dailyGoalRoutes');

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return err;
  }
};

// Define routes
app.use('/api/tasks', taskRoutes);
app.use('/api/linkedin-posts', linkedInPostRoutes);
app.use('/api/weekly-goals', weeklyGoalRoutes);
app.use('/api/daily-goals', dailyGoalRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).send('CEO Assistant API is running...');
});

// Handler for serverless function
module.exports = async (req, res) => {
  // Connect to database before handling the request
  await connectDB();
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle the request with our Express app
  return app(req, res);
}; 