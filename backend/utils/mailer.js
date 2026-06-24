const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendMail = async (options) => {
  try {
    await transporter.sendMail({
      from: `"SUST Spot Booking" <${process.env.SMTP_USER}>`,
      ...options
    });
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Email sending failed (non-blocking):', err.message);
  }
};

module.exports = { sendMail };