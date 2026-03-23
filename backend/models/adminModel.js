const db = require("../config/db");

// Find admin by email
const findAdminByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM approver WHERE approver_email = ?",
    [email]
  );
  return rows[0];
};

// Create admin
const createAdmin = async ({ name, email, designation, password }) => {
  const [result] = await db.query(
    `INSERT INTO approver 
    (approver_name, approver_email, approver_designation, password)
    VALUES (?, ?, ?, ?)`,
    [name, email, designation, password]
  );
  return result;
};

// Get admin by ID
const getAdminById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM approver WHERE approver_id = ?",
    [id]
  );
  return rows[0];
};

// Update admin
const updateAdmin = async (id, { name, designation, signature }) => {
  await db.query(
    `UPDATE approver
     SET approver_name=?, approver_designation=?, approver_signature=?
     WHERE approver_id=?`,
    [name, designation, signature, id]
  );
};

module.exports = {
  findAdminByEmail,
  createAdmin,
  getAdminById,
  updateAdmin
};