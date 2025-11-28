// src/modules/auth/auth.controller.js
const authService = require("./auth.service");

async function handleLogin(req, res, next) {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        error: "USERNAME_PASSWORD_REQUIRED",
        message: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.",
      });
    }

    const user = await authService.login(username, password);

    // Có thể sinh token nếu muốn, nhưng bài này chỉ trả user
    return res.json({
      data: {
        user,
      },
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        error: err.message,
      });
    }
    next(err);
  }
}

module.exports = {
  handleLogin,
};
