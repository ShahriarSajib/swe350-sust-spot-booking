const db = require('../db');
const bcrypt = require('bcryptjs');


exports.registerUser = async (req, res) => {
  try {
    const { full_name, userType, department, organization, designation, email, contactNumber, password } = req.body;
    let idFile = req.file ? req.file.filename : null;

    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user
      const sql = `INSERT INTO users (full_name, user_type, department, organization, designation, email, contact_number, password, id_file)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(sql, [
        full_name,
        userType,
        userType === 'internal' ? department : null,
        userType === 'external' ? organization : null,
        userType === 'external' ? designation : null,
        email,
        contactNumber,
        hashedPassword,
        idFile
      ], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
      });
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN =================
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type
      }
    });
  });
};

// ================= GET USER PROFILE =================
exports.getUserProfile = (req, res) => {

  const userId = req.params.id;

  const sql = `
    SELECT 
      id,
      full_name,
      user_type,
      department,
      organization,
      designation,
      email,
      contact_number,
      id_file,
      profile_picture,
      signature

    FROM users
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, results) => {

    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(results[0]);

  });
};

// ================= UPDATE USER PROFILE =================
exports.updateUserProfile = (req, res) => {
  const userId = req.params.id;
  const { full_name, department, organization, designation, contactNumber } = req.body;

  // Uploaded files
  const profile_picture = req.files?.profile_picture?.[0]?.filename;
  const signature = req.files?.signature?.[0]?.filename;

  // Get existing user first
  const getUserSql = "SELECT * FROM users WHERE id = ?";
  db.query(getUserSql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user = results[0];

    // Optionally delete old files if replaced
    const fs = require('fs');
    if (profile_picture && user.profile_picture) {
      fs.unlink(`uploads/${user.profile_picture}`, err => {});
    }
    if (signature && user.signature) {
      fs.unlink(`uploads/${user.signature}`, err => {});
    }

    // Build dynamic update data
    const updateData = {};
    if (full_name) updateData.full_name = full_name;
    if (department) updateData.department = department;
    if (organization) updateData.organization = organization;
    if (designation) updateData.designation = designation;
    if (contactNumber) updateData.contact_number = contactNumber;
    if (profile_picture) updateData.profile_picture = profile_picture;
    if (signature) updateData.signature = signature;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const updateSql = "UPDATE users SET ? WHERE id = ?";
    db.query(updateSql, [updateData, userId], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      // Return updated user
      db.query("SELECT * FROM users WHERE id = ?", [userId], (err, updatedResults) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json(updatedResults[0]);
      });
    });
  });
};