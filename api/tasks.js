// api/tasks.js
const express = require('express');
const router = express.Router();
const app = require('./index');

// Get all tasks
router.get('/', (req, res) => {
  // Forward the request to your main app
  app._router.handle(req, res);
});

// Export the handler function
module.exports = async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    return res.status(200).end();
  }

  // Forward the request to our Express app
  return app(req, res);
}; 