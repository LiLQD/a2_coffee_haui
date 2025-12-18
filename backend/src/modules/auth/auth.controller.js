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

async function handleRegister(req, res, next) {
  try {
    const { username, password, confirmPassword, fullName, email } = req.body || {};

    if (!username || !password || !fullName || !email) {
      return res.status(400).json({
        error: "MISSING_FIELDS",
        message: "Vui lòng nhập đầy đủ thông tin (username, password, fullName, email).",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "PASSWORD_TOO_SHORT",
        message: "Mật khẩu phải từ 6 ký tự.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "PASSWORD_MISMATCH",
        message: "Mật khẩu xác nhận không khớp.",
      });
    }

    const userId = await authService.register({ username, password, fullName, email });

    return res.status(201).json({
      message: "Đăng ký thành công",
      data: { userId },
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        error: err.message, // USERNAME_ALREADY_EXISTS
      });
    }
    next(err);
  }
}

module.exports = {
  handleLogin,
  handleRegister,
};
