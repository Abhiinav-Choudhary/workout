import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email, resetUrl) => {
  const from = process.env.EMAIL_FROM;

  if (!process.env.RESEND_API_KEY || !from) {
    throw new Error("Resend email configuration is missing.");
  }

  const { data, error } = await resend.emails.send({
    from,
    to: [email],
    subject: "Reset your FlexForge password",
    text: `We received a request to reset your FlexForge password.

Open this link to reset it:
${resetUrl}

This link expires in 15 minutes. If you did not request this, ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>Reset your FlexForge password</h2>
        <p>We received a request to reset your password.</p>
        <p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 20px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px">
            Reset Password
          </a>
        </p>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error("Unable to send password reset email.");
  }

  return data;
};

