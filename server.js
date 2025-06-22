const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  const ip =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
  console.log(`Request from IP: ${ip} | URL: ${req.originalUrl}`);
  next();
});

app.get('/tracker', (req, res) => {
  const ip =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
  const id = req.query.id || 'unknown';
  const timestamp = new Date().toISOString();
  fs.appendFileSync('tracker.log', `[${timestamp}] Link Click | ID: ${id} | IP: ${ip}\n`);
  res.redirect('https://example.com/thankyou');
});

app.get('/pixel', (req, res) => {
  const ip =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
  const id = req.query.id || 'unknown';
  const timestamp = new Date().toISOString();
  fs.appendFileSync('tracker.log', `[${timestamp}] Pixel Opened | ID: ${id} | IP: ${ip}\n`);
  const imgPath = path.join(__dirname, '1x1.png');
  res.sendFile(imgPath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
