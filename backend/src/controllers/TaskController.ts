import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import mongoose from 'mongoose';

// Get all tasks (with user filtering)
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('TaskController.getTasks - req.user:', req.user);
    const userId = req.user?.uid; // Get the authenticated user's ID
    console.log('TaskController.getTasks - userId:', userId);
    
    if (!userId) {
      console.log('TaskController.getTasks - No userId, returning 401');
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    console.log('TaskController.getTasks - Filtering tasks by userId:', userId);
    
    // Make sure we're explicitly filtering by exact userId match
    const tasks = await Task.find({ 
      userId: { $eq: userId } 
    }).sort({ date: -1 });
    
    console.log('TaskController.getTasks - Found tasks count:', tasks.length);
    if (tasks.length > 0) {
      console.log('TaskController.getTasks - Sample task userIds:', 
        tasks.slice(0, 3).map(t => ({ id: t._id, userId: t.userId }))
      );
    }
    
    res.status(200).json(tasks);
  } catch (error: unknown) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error' 
    });
  }
};

// Debug endpoint - get all tasks regardless of user (admin only)
export const debugGetAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Running debug endpoint to check all tasks');
    // This is just for debugging - should be removed or secured in production
    const allTasks = await Task.find().sort({ date: -1 });
    
    // Log all tasks with their user IDs to help diagnose the issue
    console.log('All tasks in database:', allTasks.map(task => ({
      _id: task._id,
      title: task.title,
      userId: task.userId
    })));
    
    res.status(200).json({
      message: 'Debug info - all tasks',
      count: allTasks.length,
      tasks: allTasks.map(task => ({
        _id: task._id,
        title: task.title,
        userId: task.userId
      }))
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get tasks by category
export const getTasksByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { category } = req.params;
    const tasks = await Task.find({ category, userId }).sort({ date: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get tasks by date
export const getTasksByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { date } = req.params;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      userId
    }).sort({ date: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Create new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('TaskController.createTask - req.user:', req.user);
    const userId = req.user?.uid;
    console.log('TaskController.createTask - userId:', userId);
    
    if (!userId) {
      console.log('TaskController.createTask - No userId, returning 401');
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // Log received fields to debug
    console.log('TaskController.createTask - Received body:', JSON.stringify({
      title: req.body.title,
      description: req.body.description || '(empty)',
      date: req.body.date,
      category: req.body.category,
      priority: req.body.priority,
      hasDescription: !!req.body.description
    }));
    
    const taskData = {
      ...req.body,
      userId
    };
    
    console.log('TaskController.createTask - Creating task with data:', taskData);
    
    const newTask = new Task(taskData);
    const savedTask = await newTask.save();
    console.log('TaskController.createTask - Saved task:', savedTask);
    
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('TaskController.createTask - Error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    // First verify the task belongs to the user
    const existingTask = await Task.findOne({ _id: id, userId });
    if (!existingTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Task ID is required' });
      return;
    }

    // First verify the task exists and belongs to the user
    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
      return;
    }

    // Now delete the task
    await Task.deleteOne({ _id: id, userId });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting task:', error);
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: 'Invalid task ID format' });
    } else {
      res.status(500).json({ 
        message: 'Server Error', 
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error' 
      });
    }
  }
};

// Toggle task completion
export const toggleTaskCompletion = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('TaskController.toggleTaskCompletion - Starting with params:', req.params);
    const userId = req.user?.uid;
    console.log('TaskController.toggleTaskCompletion - userId:', userId);
    
    if (!userId) {
      console.log('TaskController.toggleTaskCompletion - No userId, returning 401');
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    console.log('TaskController.toggleTaskCompletion - Looking for task with id:', id);
    
    // Debugging step 1: Check if the task exists at all (regardless of userId)
    const taskExists = await Task.findById(id);
    if (!taskExists) {
      console.log('TaskController.toggleTaskCompletion - Task with this ID not found in database');
      res.status(404).json({ message: 'Task not found - ID does not exist' });
      return;
    }
    
    console.log('TaskController.toggleTaskCompletion - Task exists, owner userId:', taskExists.userId);
    
    // Continue with regular check including userId
    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      console.log('TaskController.toggleTaskCompletion - Task found but userId mismatch. Task userId:', 
        taskExists.userId, 'Request userId:', userId);
      res.status(404).json({ message: 'Task not found - Permission denied' });
      return;
    }

    // Task found and belongs to user, proceed with toggle
    console.log('TaskController.toggleTaskCompletion - Task found, current completed status:', task.completed);
    task.completed = !task.completed;
    const updatedTask = await task.save();
    console.log('TaskController.toggleTaskCompletion - Task updated, new completed status:', updatedTask.completed);

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('TaskController.toggleTaskCompletion - Error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Debug utility to clean up tasks without userIds
export const cleanupTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Running cleanup utility for tasks without userIds');
    
    // Find tasks without a userId field or with a null/empty userId
    const tasksWithoutUserId = await Task.find({
      $or: [
        { userId: { $exists: false } },
        { userId: null },
        { userId: '' }
      ]
    });
    
    console.log(`Found ${tasksWithoutUserId.length} tasks without valid userIds`);
    
    // Option 1: Delete these tasks
    if (tasksWithoutUserId.length > 0) {
      const deleteResult = await Task.deleteMany({
        $or: [
          { userId: { $exists: false } },
          { userId: null },
          { userId: '' }
        ]
      });
      
      console.log(`Deleted ${deleteResult.deletedCount} tasks without userIds`);
    }
    
    res.status(200).json({
      message: 'Cleanup complete',
      tasksFoundWithoutUserId: tasksWithoutUserId.length,
      tasksDeleted: tasksWithoutUserId.length,
      sampleTasks: tasksWithoutUserId.slice(0, 5).map(t => ({
        id: t._id,
        title: t.title
      }))
    });
  } catch (error) {
    console.error('Cleanup utility error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
}; 