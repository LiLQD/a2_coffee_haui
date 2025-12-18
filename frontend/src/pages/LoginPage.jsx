// src/pages/LoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/login.css";
import hauiLogo from "../assets/images/haui-logo.png";
import { login } from "../services/authApi";
import { setUser } from "../utils/authStore";

const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY;

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    try {
      const user = await login(username, password);
      // user object from backend should have role, etc.
      // If backend user has api_key, use it, or fallback to environment (for admin demo)
      // Actually backend user.api_key might be null for normal users.

      setUser(user);

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard"); // Or home but admin usually goes to dashboard
      } else {
        navigate("/home");
      }
    } catch (err) {
      alert(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="app-grid">
      <div className="login-column">
        <h2 className="login-title">A2-COFFEE-HAUI</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-row">
            <label htmlFor="username">Tên đăng nhập:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nhập tên đăng nhập..."
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
              required
            />
          </div>

          <button type="submit">Đăng nhập</button>

          <button
            type="button"
            className="register"
            style={{ marginTop: "10px" }}
            onClick={() => navigate("/register")}
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
