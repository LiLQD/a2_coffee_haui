// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/login.css"; // Reuse login styles
import hauiLogo from "../assets/images/haui-logo.png";
import { register } from "../services/authApi";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        const form = e.currentTarget;
        const fullName = form.fullName.value.trim();
        const email = form.email.value.trim();
        const username = form.username.value.trim();
        const password = form.password.value.trim();
        const confirmPassword = form.confirmPassword.value.trim();

        // Client-side validation
        if (!fullName || !email || !username || !password || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            await register({
                fullName,
                email,
                username,
                password,
                confirmPassword,
            });
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate("/");
        } catch (err) {
            console.error(err);
            if (err.message === "USERNAME_ALREADY_EXISTS") {
                setError("Tên đăng nhập đã tồn tại.");
            } else {
                setError(err.message || "Đăng ký thất bại.");
            }
        }
    };

    return (
        <div className="app-grid">
            <div className="login-column">
                <h2 className="login-title">ĐĂNG KÝ TÀI KHOẢN</h2>

                <form className="login-form" onSubmit={handleRegister}>
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-row">
                        <label htmlFor="fullName">Họ và tên:</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Nhập họ tên..."
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Nhập email..."
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="username">Tên đăng nhập:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Nhập username..."
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="password">Mật khẩu:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Mật khẩu (>= 6 ký tự)..."
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="confirmPassword">Nhập lại MK:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu..."
                            required
                        />
                    </div>

                    <button type="submit" className="register">
                        Đăng ký
                    </button>

                    <button
                        type="button"
                        style={{ marginTop: "10px", backgroundColor: "#6c757d" }}
                        onClick={() => navigate("/")}
                    >
                        Quay lại Đăng nhập
                    </button>
                </form>
            </div>

            <div className="logo-column">
                <img src={hauiLogo} alt="Logo HaUI" className="haui-logo" />
            </div>
        </div>
    );
}
