import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db-connect';
import { createControllerAdapter } from '@/lib/controller-adapter';
import * as TaskController from '@/backend/src/controllers/TaskController';

// Initialize required models
import '@/backend/src/models/Task';

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
const toggleTaskCompletionHandler = createControllerAdapter(TaskController.toggleTaskCompletion);

// PATCH /api/tasks/[id]/toggle - Toggle task completion status
export const PATCH = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return toggleTaskCompletionHandler(req, { params });
}); 