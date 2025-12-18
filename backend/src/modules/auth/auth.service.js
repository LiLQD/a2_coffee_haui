const authDao = require("./auth.dao");
const bcrypt = require("bcryptjs");

/**
 * Đăng nhập: hỗ trợ cả hash và plaintext (cho tk cũ)
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

  // Kiểm tra password
  let isMatch = false;
  // Nếu hash bắt đầu bằng $2... thì là bcrypt
  if (user.password_hash && user.password_hash.startsWith("$2")) {
    isMatch = await bcrypt.compare(password, user.password_hash);
  } else {
    // So sánh trực tiếp (legacy format)
    isMatch = password === user.password_hash;
  }

  if (!isMatch) {
    const err = new Error("INVALID_CREDENTIALS");
    err.status = 401;
    throw err;
  }

  // Không trả password_hash ra ngoài
  const { password_hash, ...safeUser } = user;

  return safeUser;
}

/**
 * Đăng ký user mới
 */
async function register(data) {
  const { username, password, fullName, email } = data;

  // 1. Kiểm tra tồn tại
  const exist = await authDao.findByUsername(username);
  if (exist) {
    const err = new Error("USERNAME_ALREADY_EXISTS");
    err.status = 409;
    throw err;
  }

  // 2. Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Tạo user
  const userId = await authDao.createUser({
    username,
    passwordHash,
    fullName,
    email,
  });

  return userId;
}

module.exports = {
  login,
  register,
};
