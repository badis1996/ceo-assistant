# CEO Assistant

A comprehensive management tool for busy executives, allowing you to manage tasks, goals, and LinkedIn posts from a single dashboard.

## Features

- **Task Management**: Create, track, and organize tasks by category (product, sales, marketing)
- **Weekly & Daily Goals**: Set and track your personal and team goals
- **LinkedIn Post Scheduler**: Manage your content strategy
- **Interactive Dashboard**: Get a complete overview of your priorities

## Project Structure

```
CEO-Assistant/
├── app/                      # Frontend Next.js app directory
├── backend/                  # Backend Node.js Express API
├── components/               # Reusable UI components
├── lib/                      # Utility functions and state management
├── public/                   # Static assets
└── styles/                   # Global styles
```

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ceo-assistant.git
   cd ceo-assistant
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```

## Configuration

### Backend Configuration

1. Create a `.env` file in the `backend` directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

   If you're using MongoDB Atlas:
   - Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Click "Connect" on your cluster
   - Choose "Connect your application" and copy the connection string
   - Replace `your_mongodb_connection_string` with this URL, updating username and password


## Running the Application

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000/api`

3. For production:
   ```bash
   npm run build
   npm start
   ```

### Running the Frontend

1. In a new terminal, from the project root directory:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

2. For production:
   ```bash
   npm run build
   npm start
   ```

## Deployment

### Backend Deployment

The backend includes a `vercel.json` configuration for deployment to Vercel:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd backend
   vercel
   ```

### Frontend Deployment

The Next.js frontend can be deployed to Vercel:

1. From the project root:
   ```bash
   vercel
   ```

## API Endpoints

The backend API includes the following routes:

- `/api/tasks` - Task management
  - GET: List all tasks
  - POST: Create a new task
  - PUT /:id: Update task
  - DELETE /:id: Delete task
  - PATCH /:id/toggle: Toggle task completion

- `/api/linkedin-posts` - LinkedIn post management
  - GET: List all posts
  - POST: Create a new post
  - PUT /:id: Update post
  - DELETE /:id: Delete post

- `/api/weekly-goals` - Weekly goals management
  - GET: List all weekly goals
  - POST: Create a new goal
  - PUT /:id: Update goal
  - DELETE /:id: Delete goal
  - PATCH /:id/toggle: Toggle goal completion

- `/api/daily-goals` - Daily goals management
  - GET: List all daily goals
  - POST: Create a new goal
  - PUT /:id: Update goal
  - DELETE /:id: Delete goal
  - PATCH /:id/toggle: Toggle goal completion

## Authentication

The application uses Firebase Authentication. To set it up:

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Add your configuration to the `.env.local` file as described above

## Troubleshooting

### Backend Issues

- **MongoDB Connection Errors**: Check your MongoDB connection string in the `.env` file
- **Port Already in Use**: Change the PORT value in your `.env` file

### Frontend Issues

- **API Connection Errors**: Ensure the backend is running and `NEXT_PUBLIC_API_URL` is correctly set
- **Authentication Errors**: Verify your Firebase configuration

## License

MIT 