import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db-connect';
import { createControllerAdapter } from '@/lib/controller-adapter';
import * as WeeklyGoalController from '@/backend/src/controllers/WeeklyGoalController';

// Initialize required models
import '@/backend/src/models/WeeklyGoal';

// Connect to MongoDB before handling any request
const withDB = (handler: (req: NextRequest, context: any) => Promise<NextResponse>) => {
  return async (req: NextRequest, context: any) => {
    try {
      await connectDB();
      return handler(req, context);
    } catch (error) {
      console.error('Database connection error:', error);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
  };
};

// Adapt controllers
const toggleGoalCompletionHandler = createControllerAdapter(WeeklyGoalController.toggleWeeklyGoalCompletion);

// PATCH /api/weekly-goals/[id]/toggle - Toggle weekly goal completion status
export const PATCH = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return toggleGoalCompletionHandler(req, { params });
}); 