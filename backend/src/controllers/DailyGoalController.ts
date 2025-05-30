import { Request, Response } from 'express';
import DailyGoal from '../models/DailyGoal';
import mongoose from 'mongoose';

// Get all daily goals
export const getDailyGoals = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const goals = await DailyGoal.find({ 
      userId: { $eq: userId } 
    }).sort({ date: -1 });
    
    res.status(200).json(goals);
  } catch (error: unknown) {
    console.error('Error getting daily goals:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error' 
    });
  }
};

// Get daily goals for a specific date
export const getDailyGoalsByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { date } = req.params;
    if (!date) {
      res.status(400).json({ message: 'Date parameter is required' });
      return;
    }

    const startDate = new Date(date);
    if (isNaN(startDate.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }

    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const goals = await DailyGoal.find({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      userId
    }).sort({ date: 1 });

    res.status(200).json(goals);
  } catch (error: unknown) {
    console.error('Error getting daily goals by date:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error' 
    });
  }
};

// Create new daily goal
export const createDailyGoal = async (req: Request, res: Response): Promise<void> => {
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
    
    const newGoal = new DailyGoal(goalData);
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update daily goal
export const updateDailyGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    
    // First verify the goal belongs to the user
    const existingGoal = await DailyGoal.findOne({ _id: id, userId });
    if (!existingGoal) {
      res.status(404).json({ message: 'Daily goal not found' });
      return;
    }
    
    const updatedGoal = await DailyGoal.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete daily goal
export const deleteDailyGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Goal ID is required' });
      return;
    }

    // First verify the goal exists and belongs to the user
    const goal = await DailyGoal.findOne({ _id: id, userId });
    if (!goal) {
      res.status(404).json({ message: 'Daily goal not found or you do not have permission to delete it' });
      return;
    }

    // Now delete the goal
    await DailyGoal.deleteOne({ _id: id, userId });
    res.status(200).json({ message: 'Daily goal deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting daily goal:', error);
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: 'Invalid goal ID format' });
    } else {
      res.status(500).json({ 
        message: 'Server Error', 
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error' 
      });
    }
  }
};

// Toggle daily goal completion
export const toggleDailyGoalCompletion = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    const goal = await DailyGoal.findOne({ _id: id, userId });

    if (!goal) {
      res.status(404).json({ message: 'Daily goal not found' });
      return;
    }

    goal.completed = !goal.completed;
    const updatedGoal = await goal.save();

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
}; 