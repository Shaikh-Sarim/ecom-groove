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
  res.sendFile(path.join(__dirname, 'index_new.html'));
});

app.post('/api/contact', async (req, res) => {
  const { name, email, brand, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
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

    res.json({ success: true, message: 'Your message has been sent.' });
  } catch (error) {
    console.error('Email send failed:', error);
    res.status(500).json({ success: false, message: 'Unable to send message right now.' });
  }
});

// Catch-all route to serve index_new.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index_new.html'));
});

const isConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_TO;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!isConfigured) {
    console.log('Email configuration is incomplete. Update the .env file with SMTP details before sending mail.');
  }
});
