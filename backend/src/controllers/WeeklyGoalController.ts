import { Request, Response } from 'express';
import WeeklyGoal from '../models/WeeklyGoal';
import { startOfWeek, endOfWeek } from 'date-fns';

// Get all weekly goals
export const getWeeklyGoals = async (req: Request, res: Response): Promise<void> => {
  try {
    const goals = await WeeklyGoal.find().sort({ date: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get weekly goals for a specific week
export const getWeeklyGoalsByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Week starts on Monday
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });

    const goals = await WeeklyGoal.find({
      date: {
        $gte: weekStart,
        $lte: weekEnd
      }
    }).sort({ date: 1 });

    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Create new weekly goal
export const createWeeklyGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const newGoal = new WeeklyGoal(req.body);
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update weekly goal
export const updateWeeklyGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedGoal = await WeeklyGoal.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedGoal) {
      res.status(404).json({ message: 'Weekly goal not found' });
      return;
    }

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete weekly goal
export const deleteWeeklyGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const goal = await WeeklyGoal.findByIdAndDelete(id);

    if (!goal) {
      res.status(404).json({ message: 'Weekly goal not found' });
      return;
    }

    res.status(200).json({ message: 'Weekly goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Toggle weekly goal completion
export const toggleWeeklyGoalCompletion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const goal = await WeeklyGoal.findById(id);

    if (!goal) {
      res.status(404).json({ message: 'Weekly goal not found' });
      return;
    }

    goal.completed = !goal.completed;
    const updatedGoal = await goal.save();

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
}; 