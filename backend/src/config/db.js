const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'a2_coffee_haui',
  password: '@!Dung15112005',   // giống hệt lúc bạn CREATE USER
  database: 'a2_snack',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
