import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db-connect';
import { createControllerAdapter } from '@/lib/controller-adapter';
import * as WeeklyGoalController from '@/backend/src/controllers/WeeklyGoalController';
import { mockWeeklyGoals } from '@/lib/mock-data';

// Initialize required models
import '@/backend/src/models/WeeklyGoal';

// Determine if we're in development
const isDev = process.env.NODE_ENV === 'development';

// Connect to MongoDB before handling any request
const withDB = (handler: (req: NextRequest) => Promise<NextResponse>) => {
  return async (req: NextRequest) => {
    try {
      // Connect to DB in both dev and production
      await connectDB();
      return handler(req);
    } catch (error) {
      console.error('Database connection error:', error);
      // Fall back to mock data
      return NextResponse.json(mockWeeklyGoals);
    }
  };
};

// Adapt controllers
const getGoalsHandler = createControllerAdapter(WeeklyGoalController.getWeeklyGoals);
const createGoalHandler = createControllerAdapter(WeeklyGoalController.createWeeklyGoal);

// GET /api/weekly-goals - Get all weekly goals
export const GET = withDB(async (req: NextRequest) => {
  return getGoalsHandler(req);
});

// POST /api/weekly-goals - Create a new weekly goal
export const POST = withDB(async (req: NextRequest) => {
  return createGoalHandler(req);
}); 