import express from 'express';
import {
  getPosts,
  getPostsByStatus,
  createPost,
  updatePost,
  deletePost,
  updatePostStatus
} from '../controllers/LinkedInPostController';

const router = express.Router();

// Get all posts
router.get('/', getPosts);

// Get posts by status
router.get('/status/:status', getPostsByStatus);

// Create new post
router.post('/', createPost);

// Update post
router.put('/:id', updatePost);

// Delete post
router.delete('/:id', deletePost);

// Update post status
router.patch('/:id/status', updatePostStatus);

export default router; 