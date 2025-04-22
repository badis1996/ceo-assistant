import mongoose from 'mongoose';
import config from './index';

// Cache connection status
let isConnecting = false;

const connectDB = async (): Promise<void> => {
  try {
    // If we're already connecting, don't attempt another connection
    if (isConnecting) {
      console.log('MongoDB connection already in progress, waiting...');
      return;
    }

    // If we're already connected, just return
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return;
    }

    isConnecting = true;
    console.log('Connecting to MongoDB...');

    // MongoDB connection options optimized for MongoDB Atlas
    const options = {
      // Auto-create indexes in production - turn off if needed for large collections
      autoIndex: true,
      // Connection timeout in ms (30 seconds)
      connectTimeoutMS: 30000,
      // Socket timeout in ms (45 seconds)
      socketTimeoutMS: 45000,
      // Server selection timeout in ms (30 seconds)
      serverSelectionTimeoutMS: 30000,
      // Heartbeat frequency in ms (10 seconds)
      heartbeatFrequencyMS: 10000,
      // How long to wait before timing out (10 seconds)
      maxIdleTimeMS: 45000,
      // Retry connection logic
      retryWrites: true,
      // Set maximum pool size
      maxPoolSize: 50,
      // Set minimum pool size
      minPoolSize: 5
    };

    if (!config.mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables. Please run npm run setup-mongodb');
    }

    const conn = await mongoose.connect(config.mongoUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Setup connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnecting = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
    // Check if we're connected to Atlas
    const isAtlas = config.mongoUri.includes('mongodb+srv');
    if (isAtlas) {
      console.log('Using MongoDB Atlas cloud database');
    } else {
      console.log('Using local MongoDB database');
    }
    
    isConnecting = false;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    isConnecting = false;
    // Don't exit on connection error to allow retries
    // process.exit(1);
  }
};

export default connectDB; 