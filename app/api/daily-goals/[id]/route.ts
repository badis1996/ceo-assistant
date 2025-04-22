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
const updateGoalHandler = createControllerAdapter(DailyGoalController.updateDailyGoal);
const deleteGoalHandler = createControllerAdapter(DailyGoalController.deleteDailyGoal);

// PUT /api/daily-goals/[id] - Update a daily goal
export const PUT = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return updateGoalHandler(req, { params });
});

// DELETE /api/daily-goals/[id] - Delete a daily goal
export const DELETE = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return deleteGoalHandler(req, { params });
}); 