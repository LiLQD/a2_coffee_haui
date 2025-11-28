// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/styles/login.css";
import hauiLogo from "../assets/images/haui-logo.png";

import { login } from "../services/authApi";
import { saveUser } from "../utils/authStore";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const user = await login(username.trim(), password.trim());

      // Lưu user vào localStorage để các trang khác dùng userId
      saveUser(user);

      alert(`Đăng nhập thành công. Xin chào ${user.full_name || user.username}!`);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError(err.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-grid">
      <div className="login-column">
        <h2 className="login-title">A2-COFFEE-HAUI</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="username">Tên đăng nhập:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {/* Nút Đăng ký để đó (chưa triển khai) */}
          <button
            className="register"
            type="button"
            onClick={() => alert("Chức năng đăng ký sẽ làm sau.")}
          >
            Đăng ký
          </button>
        </form>
      </div>

      <div className="logo-column">
        <img src={hauiLogo} alt="Logo HaUI" className="haui-logo" />
      </div>
    </div>
  );
}
