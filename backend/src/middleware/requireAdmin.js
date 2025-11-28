// middleware kiểm tra quyền admin
const db = require("../config/db");

async function requireAdmin(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ error: "API_KEY_MISSING" });
    }

    // Kiểm tra API key trong bảng users
    const [rows] = await db.query(
      `SELECT id, username, role FROM users WHERE api_key = ? LIMIT 1`,
      [apiKey]
    );

    if (!rows.length) {
      return res.status(403).json({ error: "INVALID_API_KEY" });
    }

    const user = rows[0];

    if (user.role !== "ADMIN") {
      return res.status(403).json({ error: "FORBIDDEN_NOT_ADMIN" });
    }

    // lưu user vào request để dùng tiếp
    req.adminUser = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireAdmin;
