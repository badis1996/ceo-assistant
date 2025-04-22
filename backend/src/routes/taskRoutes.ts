import express from 'express';
import {
  getTasks,
  getTasksByCategory,
  getTasksByDate,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  debugGetAllTasks,
  cleanupTasks
} from '../controllers/TaskController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Debug routes (not protected by auth middleware)
router.get('/debug/all', debugGetAllTasks);
router.get('/debug/cleanup', cleanupTasks);

// Apply auth middleware to all regular routes
router.use(authMiddleware);

// Get all tasks
router.get('/', getTasks);

// Get tasks by category
router.get('/category/:category', getTasksByCategory);

// Get tasks by date
router.get('/date/:date', getTasksByDate);

// Create new task
router.post('/', createTask);

// Update task
router.put('/:id', updateTask);

// Delete task
router.delete('/:id', deleteTask);

// Toggle task completion
router.patch('/:id/toggle', toggleTaskCompletion);

export default router; 