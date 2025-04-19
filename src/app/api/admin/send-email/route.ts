// src/app/api/admin/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { recipients, message, subject, cc, bcc, isHtml = false } = await req.json();

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0 || !message) {
    return NextResponse.json({ error: 'Recipients and message are required' }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients,
      cc: cc || [],
      bcc: bcc || [],
      subject: subject || 'Message from Admin',
      text: isHtml ? undefined : message,
      html: isHtml ? message : undefined,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[EmailSendError]', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
