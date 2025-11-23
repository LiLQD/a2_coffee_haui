import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import hauiLogo from "../assets/haui-logo.png";

export default function Login() {
  const navigate = useNavigate();

  // xử lý khi nhấn Đăng nhập
  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    // Kiểm tra tài khoản tạm thời (demo)
    if (username === "admin" && password === "123") {
      navigate("/home");
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="app-grid">
      <div className="login-column">
        <h2 className="login-title">A2-COFFEE-HAUI</h2>

        {/* thêm onSubmit */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-row">
            <label htmlFor="username">Tên đăng nhập:</label>
            {/* thêm name để lấy giá trị */}
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
          <button className="register" type="button">
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
