import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db-connect';
import { createControllerAdapter } from '@/lib/controller-adapter';
import * as TaskController from '@/backend/src/controllers/TaskController';
import { mockTasks } from '@/lib/mock-data';

// Initialize required models
import '@/backend/src/models/Task';

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
      return NextResponse.json(mockTasks);
    }
  };
};

// Adapt controllers
const getTasksHandler = createControllerAdapter(TaskController.getTasks);
const createTaskHandler = createControllerAdapter(TaskController.createTask);

// GET /api/tasks - Get all tasks
export const GET = withDB(async (req: NextRequest) => {
  return getTasksHandler(req);
});

// POST /api/tasks - Create a new task
export const POST = withDB(async (req: NextRequest) => {
  return createTaskHandler(req);
}); 