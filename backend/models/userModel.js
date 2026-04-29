const db = require('../config/db');

exports.findUserByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

exports.createUser = async (fields, values) => {
  const sql = `INSERT INTO users (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`;
  return db.query(sql, values);
};

exports.findUserById = async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0]; 
};

exports.updateUser = async (id, updateData) => {
  return db.query(
    'UPDATE users SET ? WHERE id = ?',
    [updateData, id]
  );
};