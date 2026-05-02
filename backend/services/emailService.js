const nodemailer = require("nodemailer");

// 🔹 Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        // e.g. smtp.gmail.com
  port: process.env.SMTP_PORT,        // 587
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 🔹 Send email function
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"SUST Spot Booking" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("📧 Email sent to:", to);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
};

module.exports = { sendEmail };