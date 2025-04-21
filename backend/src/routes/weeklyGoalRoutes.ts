import express from 'express';
import {
  getWeeklyGoals,
  getWeeklyGoalsByDate,
  createWeeklyGoal,
  updateWeeklyGoal,
  deleteWeeklyGoal,
  toggleWeeklyGoalCompletion
} from '../controllers/WeeklyGoalController';

const router = express.Router();

// Get all weekly goals
router.get('/', getWeeklyGoals);

// Get weekly goals for a specific week
router.get('/date/:date', getWeeklyGoalsByDate);

// Create new weekly goal
router.post('/', createWeeklyGoal);

// Update weekly goal
router.put('/:id', updateWeeklyGoal);

// Delete weekly goal
router.delete('/:id', deleteWeeklyGoal);

// Toggle weekly goal completion
router.patch('/:id/toggle-completion', toggleWeeklyGoalCompletion);

export default router; 