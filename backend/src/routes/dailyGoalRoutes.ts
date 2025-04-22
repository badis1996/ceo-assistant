import express from 'express';
import {
  getDailyGoals,
  getDailyGoalsByDate,
  createDailyGoal,
  updateDailyGoal,
  deleteDailyGoal,
  toggleDailyGoalCompletion
} from '../controllers/DailyGoalController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Daily Goal routes
router.get('/', getDailyGoals);
router.get('/date/:date', getDailyGoalsByDate);
router.post('/', createDailyGoal);
router.put('/:id', updateDailyGoal);
router.delete('/:id', deleteDailyGoal);
router.patch('/:id/toggle', toggleDailyGoalCompletion);

export default router; 