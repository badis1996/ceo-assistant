import { Request, Response } from 'express';
import LinkedInPost, { ILinkedInPost } from '../models/LinkedInPost';
import mongoose from 'mongoose';

// Get all LinkedIn posts
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // Use strict equality filtering
    const posts = await LinkedInPost.find({ 
      userId: { $eq: userId } 
    }).sort({ date: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get posts by status
export const getPostsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { status } = req.params;
    const posts = await LinkedInPost.find({ status, userId }).sort({ date: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Create new LinkedIn post
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const postData = {
      ...req.body,
      userId
    };
    
    const newPost = new LinkedInPost(postData);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update LinkedIn post
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    
    // First verify the post belongs to the user
    const existingPost = await LinkedInPost.findOne({ _id: id, userId });
    if (!existingPost) {
      res.status(404).json({ message: 'LinkedIn post not found' });
      return;
    }
    
    const updatedPost = await LinkedInPost.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete LinkedIn post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ message: 'Post ID is required' });
      return;
    }

    // First verify the post exists and belongs to the user
    const post = await LinkedInPost.findOne({ _id: id, userId });
    
    if (!post) {
      res.status(404).json({ message: 'LinkedIn post not found or you do not have permission to delete it' });
      return;
    }

    // Now delete the post
    await LinkedInPost.deleteOne({ _id: id, userId });

    res.status(200).json({ message: 'LinkedIn post deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting LinkedIn post:', error);
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: 'Invalid post ID format' });
    } else {
      res.status(500).json({ 
        message: 'Server Error', 
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error' 
      });
    }
  }
};

// Update LinkedIn post status
export const updatePostStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['scheduled', 'posted', 'open'].includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    const post = await LinkedInPost.findOne({ _id: id, userId });

    if (!post) {
      res.status(404).json({ message: 'LinkedIn post not found' });
      return;
    }

    post.status = status as ILinkedInPost['status'];
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
}; 