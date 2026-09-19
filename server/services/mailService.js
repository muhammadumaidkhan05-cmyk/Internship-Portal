const nodemailer = require("nodemailer");

// ============================================================
// MAIL SERVICE
// Password reset email delivery. SMTP is optional: when it is
// not configured the caller is told delivery did not happen so
// it can surface the reset link instead of pretending an email
// was sent.
// ============================================================

let cachedTransporter = null;

const isConfigured = () =>
  Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const getTransporter = () => {
  if (!isConfigured()) return null;

  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return cachedTransporter;
};

const sendPasswordResetEmail = async ({ to, name, resetLink }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      "EMAIL_USER / EMAIL_PASS are not set - password reset email was not sent."
    );

    return { sent: false, reason: "smtp_not_configured" };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "MSN Academy - Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #0B2345;">MSN Academy</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password.</p>
          <p>Click the button below to create a new password:</p>
          <a
            href="${resetLink}"
            style="display:inline-block;padding:12px 24px;background-color:#2563EB;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;"
          >
            Reset Password
          </a>
          <p style="margin-top:20px;">This link expires in <strong>15 minutes</strong>.</p>
          <p>If you did not request a password reset you can ignore this email.</p>
          <p>Regards,<br />MSN Academy</p>
        </div>
      `,
    });

    return { sent: true };
  } catch (error) {
    console.error("Password reset email error:", error.message);

    return { sent: false, reason: error.message };
  }
};

module.exports = {
  isConfigured,
  sendPasswordResetEmail,
};
