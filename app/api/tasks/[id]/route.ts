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
const updateTaskHandler = createControllerAdapter(TaskController.updateTask);
const deleteTaskHandler = createControllerAdapter(TaskController.deleteTask);
const toggleTaskCompletionHandler = createControllerAdapter(TaskController.toggleTaskCompletion);

// Route handlers for /api/tasks/[id]
export const GET = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // This route is not implemented in the original controller, but could be added
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
});

export const PUT = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return updateTaskHandler(req, { params });
});

export const DELETE = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return deleteTaskHandler(req, { params });
});

// PATCH for toggle completion
export const PATCH = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const url = new URL(req.url);
  // Check if this is a toggle endpoint
  if (url.pathname.endsWith('/toggle')) {
    return toggleTaskCompletionHandler(req, { params });
  }
  
  // Default response for other PATCH operations
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}); 