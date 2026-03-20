import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async ({ to, token }) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  const verifyLink = `${frontendUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject: "Verify your email",
    html: `
      <h1>Verify your email</h1>
      <p>Click the button below to verify your email address.</p>
      <p>This link will expire in 1 hour.</p>
      <a href="${verifyLink}" style="display:inline-block;padding:10px 16px;background:#ff0000;color:#fff;text-decoration:none;border-radius:4px;">Verify Email</a>
      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p>${verifyLink}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

