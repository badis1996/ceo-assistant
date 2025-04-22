import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Cache the MongoDB connection
let cachedConnection: typeof mongoose | null = null;
let isConnecting = false;

export const connectDB = async (): Promise<typeof mongoose> => {
  // If already connected, return the cached connection
  if (cachedConnection) {
    return cachedConnection;
  }

  // If connection is in progress, wait a bit and check again
  if (isConnecting) {
    console.log('Connection in progress, waiting...');
    // Wait 1 second and try again
    await new Promise(resolve => setTimeout(resolve, 1000));
    return connectDB();
  }

  try {
    isConnecting = true;
    console.log('Connecting to MongoDB...');
    
    // Check if we're already connected
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      cachedConnection = mongoose;
      isConnecting = false;
      return mongoose;
    }

    // Use the environment variable
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables. Please run npm run setup-mongodb');
    }
    
    // Enhanced connection options
    const conn = await mongoose.connect(uri, {
      connectTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000,   // 45 seconds timeout
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      heartbeatFrequencyMS: 10000, // 10 seconds
      maxIdleTimeMS: 45000,
      retryWrites: true,
      maxPoolSize: 50,
      minPoolSize: 5
    } as mongoose.ConnectOptions);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cachedConnection = null;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    cachedConnection = conn;
    console.log('MongoDB connected successfully');
    isConnecting = false;
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnecting = false;
    throw error;
  }
}; 