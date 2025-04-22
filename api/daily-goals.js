// api/daily-goals.js
const apiHandler = require('./index');

// Serverless handler for /api/daily-goals
module.exports = async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Set the correct path for routing in the main API handler
  req.url = req.url === '/' ? '/api/daily-goals' : `/api/daily-goals${req.url}`;
  
  // Forward to main API handler
  return apiHandler(req, res);
}; 