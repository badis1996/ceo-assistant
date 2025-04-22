// api/tasks.js
const express = require('express');
const router = express.Router();
const app = require('./index');

// Get all tasks
router.get('/', (req, res) => {
  // Forward the request to your main app
  app._router.handle(req, res);
});

// Export the handler
module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Modify the URL to match what the main app expects
  req.url = `/api/tasks${req.url === '/' ? '' : req.url}`;
  return app(req, res);
}; 