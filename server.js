// Express server for serving static files and handling client-side routing
// Used in both local development (npm start) AND Vercel production deployment

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CRITICAL: Serve static files BEFORE any routes
// This ensures CSS, JS, images are sent with correct MIME types
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: false,
  index: false, // Don't auto-serve index.html for directories
  setHeaders: (res, filePath) => {
    // Force correct MIME types to prevent HTML being parsed as JS
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
}));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve index.html for all other non-API, non-static requests (client-side routing)
// This must come AFTER static middleware
app.get('*', (req, res) => {
  // Don't serve index.html for known static file extensions
  if (/\.(css|js|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(req.path)) {
    res.status(404).send('Not found');
    return;
  }
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
