// Vercel serverless function for handling contact form submissions
// This replaces the /api/contact route from server.js for production
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, brand, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    // For form submissions (non-fetch), redirect with error
    return res.redirect(302, '/?contact=error&reason=missing-fields#contact');
  }

  try {
    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Prepare email
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

    // Send email
    await transporter.sendMail(mailOptions);

    // On success, redirect back with success flag
    return res.redirect(302, '/?contact=success#contact');
  } catch (error) {
    console.error('Email send failed:', error);
    // On failure, redirect with error flag
    return res.redirect(302, '/?contact=error#contact');
  }
}
