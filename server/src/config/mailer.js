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

export const sendPasswordResetEmail = async (email, resetUrl) => {
  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your FlexForge password",
    text: [
      "We received a request to reset your FlexForge password.",
      "",
      `Reset your password using this link: ${resetUrl}`,
      "",
      "This link expires in 15 minutes and can only be used once.",
      "If you did not request this, you can safely ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#171717">
        <h1 style="margin-bottom:8px">FLEX<span style="color:#dc2626">FORGE</span></h1>
        <h2>Reset your password</h2>
        <p>We received a request to reset your FlexForge password.</p>
        <p>Click below to choose a new password. This link expires in 15 minutes.</p>
        <p style="margin:28px 0">
          <a href="${resetUrl}" style="background:#dc2626;color:white;padding:14px 22px;border-radius:8px;text-decoration:none;font-weight:bold">
            Reset Password
          </a>
        </p>
        <p>If the button doesn't work, open this link in your browser:</p>
        <p style="word-break:break-all">${resetUrl}</p>
        <p style="color:#666;font-size:13px">
          If you didn't request a password reset, you can ignore this email.
        </p>
      </div>
    `,
  });
};
