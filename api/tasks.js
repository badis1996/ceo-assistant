// api/tasks.js
const apiHandler = require('./index');

// Serverless handler for /api/tasks
module.exports = async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Set the correct path for routing in the main API handler
  // This ensures the request is routed to the /api/tasks endpoint
  req.url = req.url === '/' ? '/api/tasks' : `/api/tasks${req.url}`;
  
  // Forward to main API handler
  return apiHandler(req, res);
}; 