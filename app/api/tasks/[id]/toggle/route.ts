import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db-connect';
import { createControllerAdapter } from '@/lib/controller-adapter';
import * as TaskController from '@/backend/src/controllers/TaskController';

// Initialize required models
import '@/backend/src/models/Task';

// Connect to MongoDB before handling any request
const withDB = async (handler: (req: NextRequest, context: any) => Promise<NextResponse>) => {
  await connectDB();
  return handler;
};

// Adapt controllers
const toggleTaskCompletionHandler = createControllerAdapter(TaskController.toggleTaskCompletion);

// PATCH /api/tasks/[id]/toggle - Toggle task completion status
export const PATCH = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return toggleTaskCompletionHandler(req, { params });
}); 