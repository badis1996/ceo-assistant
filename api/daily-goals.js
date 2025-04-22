// api/daily-goals.js
const handler = require('./index');

// Export the handler that will connect to DB and process the request
module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Since we're handling a daily-goals endpoint, modify the URL to match what the main app expects
  const path = req.url === '/' ? '' : req.url;
  req.url = `/api/daily-goals${path}`;
  
  // Call the main handler
  return handler(req, res);
}; 