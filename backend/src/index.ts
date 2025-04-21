import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import config from './config';

// Import routes
import taskRoutes from './routes/taskRoutes';
import linkedInPostRoutes from './routes/linkedInPostRoutes';
import weeklyGoalRoutes from './routes/weeklyGoalRoutes';
import dailyGoalRoutes from './routes/dailyGoalRoutes';

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api/tasks', taskRoutes);
app.use('/api/linkedin-posts', linkedInPostRoutes);
app.use('/api/weekly-goals', weeklyGoalRoutes);
app.use('/api/daily-goals', dailyGoalRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CEO Assistant API is running...');
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 