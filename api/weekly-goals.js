// api/weekly-goals.js
const app = require('./index');

// Export the handler
module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Modify the URL to match what the main app expects
  req.url = `/api/weekly-goals${req.url === '/' ? '' : req.url}`;
  return app(req, res);
}; 