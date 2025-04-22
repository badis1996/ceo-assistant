import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import config from './config';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import taskRoutes from './routes/taskRoutes';
import linkedInPostRoutes from './routes/linkedInPostRoutes';
import weeklyGoalRoutes from './routes/weeklyGoalRoutes';
import dailyGoalRoutes from './routes/dailyGoalRoutes';

// Initialize express
const app = express();

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

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB before starting the server
    await connectDB();
    
    // Start server after successful DB connection
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app; 