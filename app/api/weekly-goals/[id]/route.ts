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
const updateGoalHandler = createControllerAdapter(WeeklyGoalController.updateWeeklyGoal);
const deleteGoalHandler = createControllerAdapter(WeeklyGoalController.deleteWeeklyGoal);

// PUT /api/weekly-goals/[id] - Update a weekly goal
export const PUT = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return updateGoalHandler(req, { params });
});

// DELETE /api/weekly-goals/[id] - Delete a weekly goal
export const DELETE = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return deleteGoalHandler(req, { params });
}); 