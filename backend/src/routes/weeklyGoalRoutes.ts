import express from 'express';
import {
  getWeeklyGoals,
  getWeeklyGoalsByDate,
  createWeeklyGoal,
  updateWeeklyGoal,
  deleteWeeklyGoal,
  toggleWeeklyGoalCompletion
} from '../controllers/WeeklyGoalController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Weekly Goal routes
router.get('/', getWeeklyGoals);
router.get('/date/:date', getWeeklyGoalsByDate);
router.post('/', createWeeklyGoal);
router.put('/:id', updateWeeklyGoal);
router.delete('/:id', deleteWeeklyGoal);
router.patch('/:id/toggle', toggleWeeklyGoalCompletion);

export default router; 