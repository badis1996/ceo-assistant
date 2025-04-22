import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db-connect';
import { createControllerAdapter } from '@/lib/controller-adapter';
import * as LinkedInPostController from '@/backend/src/controllers/LinkedInPostController';

// Initialize required models
import '@/backend/src/models/LinkedInPost';

// Connect to MongoDB before handling any request
const withDB = async (handler: (req: NextRequest, context: any) => Promise<NextResponse>) => {
  await connectDB();
  return handler;
};

// Adapt controllers
const updatePostHandler = createControllerAdapter(LinkedInPostController.updatePost);
const deletePostHandler = createControllerAdapter(LinkedInPostController.deletePost);

// PUT /api/linkedin-posts/[id] - Update a LinkedIn post
export const PUT = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return updatePostHandler(req, { params });
});

// DELETE /api/linkedin-posts/[id] - Delete a LinkedIn post
export const DELETE = withDB(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return deletePostHandler(req, { params });
}); 