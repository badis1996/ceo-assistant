import { Request, Response } from 'express';
import LinkedInPost, { ILinkedInPost } from '../models/LinkedInPost';

// Get all LinkedIn posts
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await LinkedInPost.find().sort({ date: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get posts by status
export const getPostsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params;
    const posts = await LinkedInPost.find({ status }).sort({ date: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Create new LinkedIn post
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const newPost = new LinkedInPost(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update LinkedIn post
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedPost = await LinkedInPost.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedPost) {
      res.status(404).json({ message: 'LinkedIn post not found' });
      return;
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete LinkedIn post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await LinkedInPost.findByIdAndDelete(id);

    if (!post) {
      res.status(404).json({ message: 'LinkedIn post not found' });
      return;
    }

    res.status(200).json({ message: 'LinkedIn post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update LinkedIn post status
export const updatePostStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['scheduled', 'posted', 'open'].includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    const post = await LinkedInPost.findById(id);

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