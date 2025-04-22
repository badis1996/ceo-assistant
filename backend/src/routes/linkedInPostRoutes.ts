import express from 'express';
import {
  getPosts,
  getPostsByStatus,
  createPost,
  updatePost,
  deletePost
} from '../controllers/LinkedInPostController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// LinkedIn Post routes
router.get('/', getPosts);
router.get('/status/:status', getPostsByStatus);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router; 