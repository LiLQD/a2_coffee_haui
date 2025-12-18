// src/modules/auth/auth.dao.js
const db = require("../../config/db");

/**
 * Tìm user theo username
 */
async function findByUsername(username) {
  const [rows] = await db.query(
    `
    SELECT id, username, password_hash, full_name, phone, address, role, is_active
    FROM users
    WHERE username = ?
    LIMIT 1
    `,
    [username]
  );

  return rows[0] || null;
}

/**
 * Tạo mới user
 */
async function createUser(data) {
  const { username, passwordHash, fullName, email, role } = data;
  const [result] = await db.query(
    `INSERT INTO users (username, password_hash, full_name, email, role) 
     VALUES (?, ?, ?, ?, ?)`,
    [username, passwordHash, fullName, email, role || "CUSTOMER"]
  );
  return result.insertId;
}

module.exports = {
  findByUsername,
  createUser,
};
