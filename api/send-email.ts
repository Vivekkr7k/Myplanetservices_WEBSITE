import { Resend } from 'resend';

// Replace 're_xxxxxxxxx' with your actual Resend API Key, or set the RESEND_API_KEY environment variable in Vercel / .env
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_xxxxxxxxx';
const resend = new Resend(RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  // Allow CORS for local dev & preflight checks
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, company, service, budget, message } = req.body || {};

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px; padding: 24px;">
        <div style="border-bottom: 2px solid #f6cf49; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #09090b;">New Project Brief Received — My Planet Services</h2>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #71717a;">Name:</td>
            <td style="padding: 8px 0;">${name || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #71717a;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email || 'Not provided'}</a></td>
          </tr>
          ${company ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #71717a;">Company:</td>
            <td style="padding: 8px 0;">${company}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #71717a;">Primary Discipline:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #09090b;">${service || 'General Scoping'}</td>
          </tr>
          ${budget ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #71717a;">Budget:</td>
            <td style="padding: 8px 0;">${budget}</td>
          </tr>
          ` : ''}
        </table>

        ${message ? `
        <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <strong style="display: block; margin-bottom: 8px; color: #09090b;">Project Overview / Notes:</strong>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px;">${message}</p>
        </div>
        ` : ''}

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eaeaea; font-size: 12px; color: #a1a1aa; text-align: center;">
          Sent via My Planet Services Website (Powered by Resend)
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Vivek from My Planet Services <vivek@myplanetservices.com>',
      to: 'vivek@myplanetservices.com',
      replyTo: email || undefined,
      subject: `New Project Inquiry from ${name || email || 'Website Visitor'}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error('Email server error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
