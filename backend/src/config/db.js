<<<<<<< HEAD
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
=======
// backend/src/config/db.js (hoặc src/db.js tuỳ bạn đang dùng)
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,        // a2_coffee_haui
  password: process.env.DB_PASS,    // @!Dung15112005  <-- QUAN TRỌNG
  database: process.env.DB_NAME,    // a2_snack
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

<<<<<<< HEAD
// Dùng pool.promise() để dùng async/await
module.exports = pool.promise();
=======
module.exports = pool;
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
