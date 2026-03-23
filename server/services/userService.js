const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { deleteFile } = require('../utils/fileHelper');

const crypto = require('crypto');
const { sendMail } = require('../utils/mailer');
const db = require('../config/db');

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

  const fields = ['full_name', 'user_type', 'email', 'contact_number', 'password'];
  const values = [fullName, userType, email, contactNumber, hashedPassword];

  if (userType === 'internal') {
    fields.push('department');
    values.push(department);
  }

  if (userType === 'external') {
    fields.push('profile_picture');
    values.push(file?.filename || null);
  }

  // ✅ Insert user
  const result = await userModel.createUser(fields, values);
  const userId = result[0].insertId;

  // ✅ Generate token
  const token = crypto.randomBytes(32).toString('hex');

  // ✅ Expiry (e.g., 1 hour)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // ✅ Store in tokens table
  await db.query(
    'INSERT INTO tokens (user_id, token, type, expires_at) VALUES (?, ?, ?, ?)',
    [userId, token, 'email_verification', expiresAt]
  );

  // ✅ Send email
  const verificationLink = `http://localhost:5000/api/users/verify/${token}`;

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

  return {
    id: user.id,
    email: user.email,
    user_type: user.user_type,
    full_name: user.full_name,
    contact_number: user.contact_number
  };
};

exports.getUserProfile = async (id) => {
  const user = await userModel.findUserById(id);

  if (!user) throw new Error('User not found');

  return user;
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