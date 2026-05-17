import nodemailer from 'nodemailer';
import env from '../config/env';

export const sendVerificationEmail = async (to: string, code: string) => {
  const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.user_email,
    pass: env.app_password,
  },
});

  const mailOptions = {
    from: `"Email Verification" <${env.user_email}>`,
    to,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px;">
        <h2>We're excited to have you on board. To complete your account setup</h2>
        <p>please verify your email address by entering the code below:</p>
        <h1 style="background: #f4f4f4; padding: 10px; letter-spacing: 5px; text-align: center;">${code}</h1>
        <p>This code will expire in 15 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
