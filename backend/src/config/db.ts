import mongoose from 'mongoose';
import config from './index';

const connectDB = async (): Promise<void> => {
  try {
    // MongoDB connection options optimized for MongoDB Atlas
    const options = {
      // Auto-create indexes in production - turn off if needed for large collections
      autoIndex: true,
      // No longer needed in Mongoose 6+, but kept for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Connection timeout in ms (30 seconds)
      connectTimeoutMS: 30000,
      // Socket timeout in ms (45 seconds)
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(config.mongoUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Check if we're connected to Atlas
    const isAtlas = config.mongoUri.includes('mongodb+srv');
    if (isAtlas) {
      console.log('Using MongoDB Atlas cloud database');
    } else {
      console.log('Using local MongoDB database');
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

export default connectDB; 