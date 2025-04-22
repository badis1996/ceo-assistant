import fs from 'fs';
import path from 'path';
import readline from 'readline';
import dotenv from 'dotenv';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.resolve(__dirname, '../../.env');

// Load existing env file or create a new one if it doesn't exist
const setupMongoDBAtlas = async () => {
  console.log('MongoDB Atlas Connection Setup\n');
  console.log('This script will help you configure your MongoDB Atlas connection string.');
  console.log('You can find your connection string in your MongoDB Atlas dashboard.');
  console.log('It should look like: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority\n');

  try {
    // Check if .env file exists
    let envConfig: Record<string, string> = {};
    
    if (fs.existsSync(envPath)) {
      console.log('Found existing .env file');
      // Load existing env variables
      const envFile = fs.readFileSync(envPath, 'utf8');
      
      // Parse the env file manually
      envFile.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          envConfig[key] = value;
        }
      });
    } else {
      console.log('No .env file found, creating a new one');
      envConfig = {
        PORT: '5000',
        JWT_SECRET: 'your_jwt_secret_key_here'
      };
    }

    // Prompt for MongoDB Atlas connection string
    const mongoUri = await new Promise<string>((resolve) => {
      rl.question('Enter your MongoDB Atlas connection string: ', (answer) => {
        resolve(answer.trim());
      });
    });

    if (!mongoUri) {
      console.log('No connection string provided, exiting without changes');
      rl.close();
      return;
    }

    // Update the config with the new MongoDB URI
    envConfig.MONGODB_URI = mongoUri;

    // Write the updated config back to the .env file
    const envContent = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const envFileContent = `${envContent}\n`;
    fs.writeFileSync(envPath, envFileContent);

    console.log('\n.env file updated successfully with MongoDB Atlas connection string.');
    console.log('You can now start your application with: npm run dev');
  } catch (error) {
    console.error('Error setting up MongoDB Atlas connection:', error);
  } finally {
    rl.close();
  }
};

setupMongoDBAtlas(); 