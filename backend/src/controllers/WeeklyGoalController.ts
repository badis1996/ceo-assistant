import { Request, Response } from 'express';
import WeeklyGoal from '../models/WeeklyGoal';
import { startOfWeek, endOfWeek } from 'date-fns';

// Get all weekly goals
export const getWeeklyGoals = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // Use strict equality filtering
    const goals = await WeeklyGoal.find({ 
      userId: { $eq: userId } 
    }).sort({ date: -1 });
    
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get weekly goals for a specific week
export const getWeeklyGoalsByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { date } = req.params;
    const targetDate = new Date(date);
    
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Week starts on Monday
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });

    const goals = await WeeklyGoal.find({
      date: {
        $gte: weekStart,
        $lte: weekEnd
      },
      userId
    }).sort({ date: 1 });

    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Create new weekly goal
export const createWeeklyGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const goalData = {
      ...req.body,
      userId
    };
    
    const newGoal = new WeeklyGoal(goalData);
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update weekly goal
export const updateWeeklyGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    
    // First verify the goal belongs to the user
    const existingGoal = await WeeklyGoal.findOne({ _id: id, userId });
    if (!existingGoal) {
      res.status(404).json({ message: 'Weekly goal not found' });
      return;
    }
    
    const updatedGoal = await WeeklyGoal.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete weekly goal
export const deleteWeeklyGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    
    // First verify the goal belongs to the user
    const goal = await WeeklyGoal.findOneAndDelete({ _id: id, userId });

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
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    const goal = await WeeklyGoal.findOne({ _id: id, userId });

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