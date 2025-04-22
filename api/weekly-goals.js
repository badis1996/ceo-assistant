// api/weekly-goals.js
const apiHandler = require('./index');

// Serverless handler for /api/weekly-goals
module.exports = async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Set the correct path for routing in the main API handler
  req.url = req.url === '/' ? '/api/weekly-goals' : `/api/weekly-goals${req.url}`;
  
  // Forward to main API handler
  return apiHandler(req, res);
}; 