// Express server for serving static files and handling non-API routes
// Used in both local development (npm start) AND Vercel production deployment
// Serves: index.html, styles.css, images, and script.js
// API route /api/contact is handled by /api/contact.js (Vercel serverless function)

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANT: Serve static files BEFORE any routes
// This ensures .css, .js, .png, .jpg are served as-is, not as HTML
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: false,
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    if (path.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
    if (path.endsWith('.png')) res.setHeader('Content-Type', 'image/png');
    if (path.endsWith('.jpg')) res.setHeader('Content-Type', 'image/jpeg');
  }
}));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all for other routes: serve index.html (for client-side routing)
// This MUST come AFTER static middleware so static files aren't caught
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const isConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_TO;

// Only listen if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Local dev server running on port ${PORT}`);
    if (!isConfigured) {
      console.log('Email configuration is incomplete. Update the .env file with SMTP details before sending mail.');
    }
  });
}

module.exports = app;
