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

module.exports = {
  findByUsername,
};
