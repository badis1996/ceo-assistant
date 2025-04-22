import { Request, Response, NextFunction } from 'express';

// Extend the Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Auth middleware - headers:', req.headers);
    const userId = req.headers['x-user-id'] as string;
    
    console.log('Auth middleware - extracted user ID:', userId);
    if (!userId) {
      console.log('Auth middleware - no user ID provided');
      res.status(401).json({ message: 'Unauthorized: No user ID provided' });
      return;
    }

    // Set the user ID directly without verifying the token
    req.user = { uid: userId };
    console.log('Auth middleware - set req.user:', req.user);
    next();
  } catch (error) {
    console.error('Auth middleware - error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}; 