import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set in environment variables');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOTPEmail = async (email: string, otp: string) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!, // Verified sender email
    subject: 'Your verification code',
    text: `Your verification code is: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #4F46E5; font-size: 32px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid error:', error);
    return false;
  }
};