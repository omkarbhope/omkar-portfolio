import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Log the submission
    console.log('Contact form submission:', { name, email, subject, message });

    // Send email if Resend is configured
    if (resend && process.env.ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: process.env.ADMIN_EMAIL,
          replyTo: email,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Contact Form Submission</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h3 style="color: #333; margin-top: 0;">Message:</h3>
                <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
              </div>
            </div>
          `,
        });
        console.log('Email sent successfully');
      } catch (emailError: any) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails, just log it
      }
    } else {
      console.warn('Email not sent: Resend API key or ADMIN_EMAIL not configured');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
