// backend/src/config/db.js (hoặc src/db.js tuỳ bạn đang dùng)
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,        // a2_coffee_haui
  password: process.env.DB_PASS,    // @!Dung15112005  <-- QUAN TRỌNG
  database: process.env.DB_NAME,    // a2_snack
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
