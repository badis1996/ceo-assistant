import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db-connect';
import { createControllerAdapter } from '@/lib/controller-adapter';
import * as WeeklyGoalController from '@/backend/src/controllers/WeeklyGoalController';

// Initialize required models
import '@/backend/src/models/WeeklyGoal';

// Connect to MongoDB before handling any request
const withDB = async (handler: (req: NextRequest, context: any) => Promise<NextResponse>) => {
  await connectDB();
  return handler;
};

// Adapt controllers
const toggleGoalCompletionHandler = createControllerAdapter(WeeklyGoalController.toggleWeeklyGoalCompletion);

// PATCH /api/weekly-goals/[id]/toggle - Toggle weekly goal completion status
export const PATCH = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return toggleGoalCompletionHandler(req, { params });
}); 