// src/modules/auth/auth.service.js
const authDao = require("./auth.dao");

/**
 * Đăng nhập đơn giản: so sánh password plaintext
 * (phù hợp bài tập, KHÔNG dùng cho sản phẩm thực).
 */
async function login(username, password) {
  const user = await authDao.findByUsername(username);

  if (!user) {
    const err = new Error("INVALID_CREDENTIALS");
    err.status = 401;
    throw err;
  }

  if (!user.is_active) {
    const err = new Error("USER_INACTIVE");
    err.status = 403;
    throw err;
  }

  // Demo: so sánh trực tiếp. Sau này thay bằng bcrypt.compare(...)
  if (password !== user.password_hash) {
    const err = new Error("INVALID_CREDENTIALS");
    err.status = 401;
    throw err;
  }

  // Không trả password_hash ra ngoài
  const { password_hash, ...safeUser } = user;

  return safeUser;
}

module.exports = {
  login,
};
