// Local development server only
// This file is NOT used in the Vercel deployment
// Vercel automatically detects and uses /api/contact.js as a serverless function
// To run locally: npm start (uses this server.js)
// To deploy: git push to GitHub (Vercel uses /api/contact.js)

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files with proper cache headers
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: false
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/contact', async (req, res) => {
  const { name, email, brand, message } = req.body;

  if (!name || !email || !message) {
    return res.redirect(302, '/?contact=error&reason=missing-fields#contact');
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `New inquiry from ${name} ${brand ? `(${brand})` : ''}`.trim(),
      text: `Name: ${name}\nEmail: ${email}\nStore/Brand: ${brand || 'Not provided'}\n\nMessage:\n${message}`,
      html: `
        <h3>New inquiry from Ecom Groove website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Store/Brand:</strong> ${brand || 'Not provided'}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.redirect(302, '/?contact=success#contact');
  } catch (error) {
    console.error('Email send failed:', error);
    res.redirect(302, '/?contact=error#contact');
  }
});

// Catch-all route to serve index.html for client-side routing
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
