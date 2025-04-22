// Serverless API handler for Vercel
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Create mongoose models directly here for serverless deployment
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'pending' },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const linkedInPostSchema = new mongoose.Schema({
  content: { type: String, required: true },
  scheduledDate: { type: Date },
  status: { type: String, default: 'draft' },
  createdAt: { type: Date, default: Date.now }
});

const weeklyGoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'pending' },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const dailyGoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'pending' },
  date: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Initialize models
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
const LinkedInPost = mongoose.models.LinkedInPost || mongoose.model('LinkedInPost', linkedInPostSchema);
const WeeklyGoal = mongoose.models.WeeklyGoal || mongoose.model('WeeklyGoal', weeklyGoalSchema);
const DailyGoal = mongoose.models.DailyGoal || mongoose.model('DailyGoal', dailyGoalSchema);

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Define API routes directly here
// Tasks API
app.get('/api/tasks', async (req, res) => {
  await connectDB();
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  await connectDB();
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// LinkedIn Posts API
app.get('/api/linkedin-posts', async (req, res) => {
  await connectDB();
  try {
    const posts = await LinkedInPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error);
    res.status(500).json({ error: 'Failed to fetch LinkedIn posts' });
  }
});

// Weekly Goals API
app.get('/api/weekly-goals', async (req, res) => {
  await connectDB();
  try {
    const goals = await WeeklyGoal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    console.error('Error fetching weekly goals:', error);
    res.status(500).json({ error: 'Failed to fetch weekly goals' });
  }
});

// Daily Goals API
app.get('/api/daily-goals', async (req, res) => {
  await connectDB();
  try {
    const goals = await DailyGoal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    console.error('Error fetching daily goals:', error);
    res.status(500).json({ error: 'Failed to fetch daily goals' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('CEO Assistant API is running...');
});

// Export the Express API
module.exports = app; 