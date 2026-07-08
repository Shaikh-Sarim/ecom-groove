import { IncomingMessage, ServerResponse } from 'http';
import nodemailer from 'nodemailer';

interface ContactRequest {
  name: string;
  email: string;
  brand?: string;
  message: string;
}

export default async function handler(
  req: IncomingMessage & { body?: ContactRequest },
  res: ServerResponse
): Promise<void> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const { name, email, brand, message } = req.body as ContactRequest;

  // Validate required fields
  if (!name || !email || !message) {
    res.writeHead(302, { Location: '/?contact=error&reason=missing-fields#contact' });
    res.end();
    return;
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
    res.writeHead(302, { Location: '/?contact=success#contact' });
    res.end();
  } catch (error) {
    console.error('Email send failed:', error);
    // On failure, redirect with error flag
    res.writeHead(302, { Location: '/?contact=error#contact' });
    res.end();
  }
}
