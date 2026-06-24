const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { deleteFile } = require('../utils/fileHelper');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer');
const db = require('../config/db');
const tokenModel = require('../models/tokenModel');
exports.registerUser = async (data, file) => {
  const { fullName, userType, department, email, contactNumber, password } = data;

  if (!fullName || !email || !password || !userType) {
    throw new Error('All required fields must be provided');
  }

  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const fields = ['full_name', 'user_type', 'email', 'contact_number', 'password', 'email_verified'];
  const values = [fullName, userType, email, contactNumber, hashedPassword, true];

  if (userType === 'internal') {
    fields.push('department');
    values.push(department);
  }

  if (userType === 'external') {
    fields.push('profile_picture');
    values.push(file?.filename || null);
  }

  const result = await userModel.createUser(fields, values);
  const userId = result[0].insertId;

  const token = crypto.randomBytes(32).toString('hex');

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await db.query(
    'INSERT INTO tokens (user_id, token, type, expires_at) VALUES (?, ?, ?, ?)',
    [userId, token, 'email_verification', expiresAt]
  );

  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const verificationLink = `${baseUrl}/api/users/verify/${token}`;

  await sendMail({
    to: email,
    subject: 'Verify your email',
    html: `<p>Click to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`
  });
};

exports.verifyEmail = async (token) => {
  const [rows] = await db.query(
    'SELECT * FROM tokens WHERE token = ? AND type = ?',
    [token, 'email_verification']
  );

  if (rows.length === 0) {
    throw new Error('Invalid token');
  }

  const tokenData = rows[0];

  if (new Date(tokenData.expires_at) < new Date()) {
    throw new Error('Token expired');
  }

  await db.query(
    'UPDATE users SET email_verified = true WHERE id = ?',
    [tokenData.user_id]
  );

  await db.query(
    'DELETE FROM tokens WHERE id = ?',
    [tokenData.id]
  );
};

exports.loginUser = async (email, password) => {
  const user = await userModel.findUserByEmail(email);

  if (!user) throw new Error('User not found');

  if (!user.email_verified) {
    throw new Error('Please verify your email before logging in');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid password');

  const token = jwt.sign(
    { id: user.id, user_type: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      full_name: user.full_name,
      contact_number: user.contact_number
    }
  };
};

exports.getUserProfile = async (id) => {
    try {
        const user = await userModel.findUserById(id);
        return user;
    } catch (err) {
        throw new Error("Service Error: " + err.message);
    }
};

exports.updateUserProfile = async (id, body, files) => {
  const user = await userModel.findUserById(id);

  if (!user) throw new Error('User not found');

  const profile_picture = files?.profile_picture?.[0]?.filename;
  const signature = files?.signature?.[0]?.filename;

  if (profile_picture && user.profile_picture) {
    deleteFile(`uploads/${user.profile_picture}`);
  }

  if (signature && user.signature) {
    deleteFile(`uploads/${user.signature}`);
  }

  const updateData = {};

  if (body.full_name) updateData.full_name = body.full_name;
  if (body.department) updateData.department = body.department;
  if (body.organization) updateData.organization = body.organization;
  if (body.designation) updateData.designation = body.designation;
  if (body.contactNumber) updateData.contact_number = body.contactNumber;
  if (profile_picture) updateData.profile_picture = profile_picture;
  if (signature) updateData.signature = signature;

  if (Object.keys(updateData).length === 0) {
    throw new Error('No fields provided for update');
  }

  await userModel.updateUser(id, updateData);

  return await userModel.findUserById(id);
};
exports.forgotPassword = async (email) => {
  const user = await userModel.findUserByEmail(email);

  if (!user) return true;

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await db.query(
    "DELETE FROM tokens WHERE user_id = ? AND type = ?",
    [user.id, "password_reset"]
  );

  await tokenModel.createToken(user.id, token, "password_reset", expiresAt);

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetLink = `${clientUrl}/reset-password/${token}`;

  await sendMail({
    to: email,
    subject: "Reset Your Password",
    html: `
      <h3>Password Reset Request</h3>
      <p>Click the link below:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Expires in 1 hour</p>
    `
  });

  return true;
};

exports.resetPassword = async (token, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const tokenData = await tokenModel.findToken(token, "password_reset");

  if (!tokenData) throw new Error("Invalid token");

  if (new Date(tokenData.expires_at) < new Date()) {
    await tokenModel.deleteToken(tokenData.id);
    throw new Error("Token expired");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashedPassword, tokenData.user_id]
  );

  await tokenModel.deleteToken(tokenData.id);

  return true;
};
exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userModel.findUserById(userId);

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) throw new Error("Current password is wrong");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashedPassword, userId]
  );

  return true;
};