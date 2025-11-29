// src/middleware/requireAdmin.js
const db = require("../config/db");

async function requireAdmin(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ error: "API_KEY_MISSING" });
    }

    const [rows] = await db.query(
      `SELECT id, username, role, api_key FROM users WHERE api_key = ? LIMIT 1`,
      [apiKey]
    );

    if (!rows.length) {
      return res.status(403).json({ error: "INVALID_API_KEY" });
    }

    const user = rows[0];

    if (user.role !== "ADMIN") {
      return res.status(403).json({ error: "FORBIDDEN_NOT_ADMIN" });
    }

    req.adminUser = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireAdmin;
