import { IncomingMessage, ServerResponse } from 'http';
import nodemailer from 'nodemailer';

interface ContactRequest {
  name: string;
  email: string;
  brand?: string;
  message: string;
}

const parseBody = async (req: IncomingMessage): Promise<Record<string, string>> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  const rawBody = Buffer.concat(chunks).toString();
  const contentType = String(req.headers['content-type'] || '');

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(rawBody) as Record<string, string>;
    } catch {
      return {};
    }
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(rawBody).entries());
  }

  return {};
};

export default async function handler(
  req: IncomingMessage & { body?: ContactRequest },
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const parsedBody = await parseBody(req);
  req.body = parsedBody as unknown as ContactRequest;

  const { name, email, brand, message } = req.body as ContactRequest;

  if (!name || !email || !message) {
    res.writeHead(302, { Location: '/?contact=error&reason=missing-fields#contact' });
    res.end();
    return;
  }

  try {
    const hasSmtpConfig = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    const transporter = hasSmtpConfig
      ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })
      : await (async () => {
          const testAccount = await nodemailer.createTestAccount();
          return nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
        })();

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@ecomgroove.com',
      to: process.env.CONTACT_TO || process.env.SMTP_USER || 'no-reply@ecomgroove.com',
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

    const info = await transporter.sendMail(mailOptions);
    if (!hasSmtpConfig) {
      console.log('Preview email URL:', nodemailer.getTestMessageUrl(info));
    }

    res.writeHead(302, { Location: '/?contact=success#contact' });
    res.end();
  } catch (error) {
    console.error('Email send failed:', error);
    res.writeHead(302, { Location: '/?contact=error#contact' });
    res.end();
  }
}
