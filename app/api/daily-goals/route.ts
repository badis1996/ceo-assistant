import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db-connect';
import { createControllerAdapter } from '@/lib/controller-adapter';
import * as DailyGoalController from '@/backend/src/controllers/DailyGoalController';
import { mockDailyGoals } from '@/lib/mock-data';

// Initialize required models
import '@/backend/src/models/DailyGoal';

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
      return NextResponse.json(mockDailyGoals);
    }
  };
};

// Adapt controllers
const getGoalsHandler = createControllerAdapter(DailyGoalController.getDailyGoals);
const createGoalHandler = createControllerAdapter(DailyGoalController.createDailyGoal);

// GET /api/daily-goals - Get all daily goals
export const GET = withDB(async (req: NextRequest) => {
  return getGoalsHandler(req);
});

// POST /api/daily-goals - Create a new daily goal
export const POST = withDB(async (req: NextRequest) => {
  return createGoalHandler(req);
}); 