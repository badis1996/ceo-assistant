# CEO Assistant Backend

This is the backend for the CEO Assistant application, powered by Node.js, Express, and MongoDB.

## Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
The application uses a `.env` file for configuration. You can either create this file manually or use our setup script for MongoDB Atlas.

### MongoDB Atlas Setup

To use MongoDB Atlas instead of a local MongoDB instance:

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. In the Atlas dashboard, click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string

Then run our setup script to configure your connection:

```bash
npm run setup-mongodb
```

When prompted, paste your MongoDB Atlas connection string.

## Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## API Endpoints

The API is available at `/api` and includes the following routes:

- `/api/tasks` - Task management
- `/api/linkedin-posts` - LinkedIn posts
- `/api/weekly-goals` - Weekly goals
- `/api/daily-goals` - Daily goals 