const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Middleware to log IPs on every request (optional)
app.use((req, res, next) => {
  const ip =
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    'Unknown IP';
  console.log(`Request from IP: ${ip} | URL: ${req.originalUrl}`);
  next();
});

// Link tracker: logs IP and ID, then redirects
app.get('/tracker', (req, res) => {
  const ip =
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    'Unknown IP';
  const id = req.query.id || 'unknown';
  const timestamp = new Date().toISOString();

  // Log to file
  fs.appendFileSync(
    'tracker.log',
    `[${timestamp}] Link Click | ID: ${id} | IP: ${ip}\n`
  );

  // Redirect to any page you want after logging
  res.redirect('https://example.com/thankyou');
});

// Pixel tracker: logs IP and ID, serves 1x1 image
app.get('/pixel', (req, res) => {
  const ip =
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    'Unknown IP';
  const id = req.query.id || 'unknown';
  const timestamp = new Date().toISOString();

  // Log to file
  fs.appendFileSync(
    'tracker.log',
    `[${timestamp}] Pixel Opened | ID: ${id} | IP: ${ip}\n`
  );

  // Serve the 1x1 transparent PNG
  const imgPath = path.join(__dirname, '1x1.png');
  res.sendFile(imgPath);
});

// Run the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
