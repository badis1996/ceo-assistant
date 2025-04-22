import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db-connect';
import { createControllerAdapter } from '@/lib/controller-adapter';
import * as DailyGoalController from '@/backend/src/controllers/DailyGoalController';

// Initialize required models
import '@/backend/src/models/DailyGoal';

// Connect to MongoDB before handling any request
const withDB = async (handler: (req: NextRequest, context: any) => Promise<NextResponse>) => {
  await connectDB();
  return handler;
};

// Adapt controllers
const toggleGoalCompletionHandler = createControllerAdapter(DailyGoalController.toggleDailyGoalCompletion);

// PATCH /api/daily-goals/[id]/toggle - Toggle daily goal completion status
export const PATCH = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return toggleGoalCompletionHandler(req, { params });
}); 