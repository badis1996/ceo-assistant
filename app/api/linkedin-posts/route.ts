import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db-connect';
import { createControllerAdapter } from '@/lib/controller-adapter';
import * as LinkedInPostController from '@/backend/src/controllers/LinkedInPostController';
import { mockLinkedInPosts } from '@/lib/mock-data';

// Initialize required models
import '@/backend/src/models/LinkedInPost';

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
      return NextResponse.json(mockLinkedInPosts);
    }
  };
};

// Adapt controllers
const getPostsHandler = createControllerAdapter(LinkedInPostController.getPosts);
const createPostHandler = createControllerAdapter(LinkedInPostController.createPost);

// GET /api/linkedin-posts - Get all LinkedIn posts
export const GET = withDB(async (req: NextRequest) => {
  return getPostsHandler(req);
});

// POST /api/linkedin-posts - Create a new LinkedIn post
export const POST = withDB(async (req: NextRequest) => {
  return createPostHandler(req);
}); 