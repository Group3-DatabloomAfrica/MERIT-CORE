
const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailAppPassword = process.env.EMAIL_APP_PASSWORD;

if (!emailUser || !emailAppPassword) {
  throw new Error("EMAIL_USER and EMAIL_APP_PASSWORD must be configured.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailAppPassword,
  },
});

async function sendVerificationEmail(email, verificationUrl) {
  return transporter.sendMail({
    from: `"MERIT-CORE" <${emailUser}>`,
    to: email,
    subject: "Verify your MERIT-CORE account",
    text: `Welcome to MERIT-CORE! Verify your email by opening this link: ${verificationUrl}`,
    html: `
      <h2>Welcome to MERIT-CORE</h2>
      <p>Please verify your email address to activate your account.</p>
      <p><a href="${verificationUrl}">Verify my email address</a></p>
      <p>If you did not create this account, you can ignore this email.</p>
    `,
  });
}

module.exports = { sendVerificationEmail };
