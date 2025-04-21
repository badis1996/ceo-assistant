import express from 'express';
import {
  getTasks,
  getTasksByCategory,
  getTasksByDate,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion
} from '../controllers/TaskController';

const router = express.Router();

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
router.patch('/:id/toggle-completion', toggleTaskCompletion);

export default router; 