const db = require('../config/db');

exports.createToken = async (userId, token, type, expiresAt) => {
  return db.query(
    "INSERT INTO tokens (user_id, token, type, expires_at) VALUES (?, ?, ?, ?)",
    [userId, token, type, expiresAt]
  );
};

exports.findToken = async (token, type) => {
  const [rows] = await db.query(
    "SELECT * FROM tokens WHERE token = ? AND type = ?",
    [token, type]
  );
  return rows[0];
};

exports.deleteToken = async (id) => {
  return db.query("DELETE FROM tokens WHERE id = ?", [id]);
};