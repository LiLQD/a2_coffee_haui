import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; 
import hauiLogo from "../assets/images/haui-logo.png";

const API_BASE_URL = "http://localhost:5173/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const form = e.currentTarget;
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (!username || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        // cố gắng đọc message từ backend, nếu có
        let msg = "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
        try {
          const errData = await res.json();
          if (errData && errData.message) msg = errData.message;
        } catch (_) {
          // ignore parse error
        }
        throw new Error(msg);
      }

      const data = await res.json();
      // Giả định backend trả về:
      // {
      //   success: true,
      //   data: {
      //     accessToken: "...",
      //     user: { id, username, full_name, role }
      //   }
      // }

      const payload = data.data || data; // phòng khi bạn trả trực tiếp
      const token = payload.accessToken || payload.token;
      const user = payload.user || payload.account;

      if (!token || !user) {
        throw new Error("Dữ liệu trả về từ server không hợp lệ.");
      }

      // Lưu vào localStorage để frontend dùng sau này
      localStorage.setItem("accessToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Điều hướng theo role
      if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Có lỗi xảy ra khi đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoRegister = () => {
    navigate("/register");
  };

  return (
    <div className="app-grid">
      <div className="login-column">
        <h2 className="login-title">A2 BREAKFAST HAUI</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-row">
            <label htmlFor="username">Tên đăng nhập:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nhập tên đăng nhập..."
              autoComplete="username"
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
              autoComplete="current-password"
              required
            />
          </div>

          {errorMsg && <p className="error-message">{errorMsg}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <button
            className="register"
            type="button"
            onClick={handleGoRegister}
            disabled={loading}
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
