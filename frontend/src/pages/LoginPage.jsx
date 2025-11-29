// src/pages/LoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/login.css";
import hauiLogo from "../assets/images/haui-logo.png";
import { setUser } from "../utils/authStore";

const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY;

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    // Demo đơn giản:
    // admin / 123  => ADMIN
    // user  / 123  => CUSTOMER
    if (username === "admin" && password === "123") {
      // user admin có API key để gọi bulkimport
      setUser({
        id: 1,
        username: "admin",
        fullName: "Quản trị viên",
        role: "ADMIN",
        apiKey: ADMIN_API_KEY, // rất quan trọng!
      });
      navigate("/home");
    } else if (username === "user" && password === "123") {
      // user thường không có apiKey
      setUser({
        id: 2,
        username: "user",
        fullName: "Khách hàng",
        role: "CUSTOMER",
      });
      navigate("/home");
    } else {
      alert("Sai tài khoản hoặc mật khẩu (demo: admin/123 hoặc user/123)");
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
        </form>
      </div>

      <div className="logo-column">
        <img src={hauiLogo} alt="Logo HaUI" className="haui-logo" />
      </div>
    </div>
  );
}
