const db = require("../config/db");

const findAdminByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM approver WHERE approver_email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

const getAdminById = async (id) => {
  const [rows] = await db.query(
    "SELECT approver_id, approver_name, approver_email, approver_designation, approver_signature FROM approver WHERE approver_id = ?",
    [id]
  );
  return rows[0] || null;
};

const updateAdmin = async (id, data) => {
  const { approver_name, approver_email, approver_designation } = data;
  await db.query(
    `UPDATE approver SET approver_name = ?, approver_email = ?, approver_designation = ? WHERE approver_id = ?`,
    [approver_name, approver_email, approver_designation, id]
  );
};

const updateSignature = async (id, signaturePath) => {
  await db.query(
    "UPDATE approver SET approver_signature = ? WHERE approver_id = ?",
    [signaturePath, id]
  );
};

module.exports = { findAdminByEmail, getAdminById, updateAdmin, updateSignature };