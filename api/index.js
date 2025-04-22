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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Connect to the database
connectDB();

// Define routes
app.use('/api/tasks', taskRoutes);
app.use('/api/linkedin-posts', linkedInPostRoutes);
app.use('/api/weekly-goals', weeklyGoalRoutes);
app.use('/api/daily-goals', dailyGoalRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CEO Assistant API is running...');
});

// Export the Express API
module.exports = app; 