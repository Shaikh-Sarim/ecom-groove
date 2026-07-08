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
  // This function was temporarily moved out of `api/` to force Vercel to
  // deploy the site as static so CSS/images load. Restore it to `api/` when
  // you want the contact endpoint active again.
  res.writeHead(410, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'API temporarily disabled on this deployment.' }));
}
