import express from 'express';
import {
  getDailyGoals,
  getDailyGoalsByDate,
  createDailyGoal,
  updateDailyGoal,
  deleteDailyGoal,
  toggleDailyGoalCompletion
} from '../controllers/DailyGoalController';

const router = express.Router();

// Get all daily goals
router.get('/', getDailyGoals);

// Get daily goals for a specific date
router.get('/date/:date', getDailyGoalsByDate);

// Create new daily goal
router.post('/', createDailyGoal);

// Update daily goal
router.put('/:id', updateDailyGoal);

// Delete daily goal
router.delete('/:id', deleteDailyGoal);

// Toggle daily goal completion
router.patch('/:id/toggle-completion', toggleDailyGoalCompletion);

export default router; 