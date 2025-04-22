// api/tasks.js
const express = require('express');
const router = express.Router();
const handler = require('./index');

// Get all tasks
router.get('/', (req, res) => {
  // Forward the request to your main app
  handler._router.handle(req, res);
});

// Export the handler that will connect to DB and process the request
module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Since we're handling a tasks endpoint, modify the URL to match what the main app expects
  const path = req.url === '/' ? '' : req.url;
  req.url = `/api/tasks${path}`;
  
  // Call the main handler
  return handler(req, res);
}; 