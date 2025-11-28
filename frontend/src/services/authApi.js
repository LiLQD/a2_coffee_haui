// src/services/authApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg =
      data?.error === "INVALID_CREDENTIALS"
        ? "Sai tên đăng nhập hoặc mật khẩu."
        : data?.message || "Đăng nhập thất bại.";
    throw new Error(msg);
  }

  const json = await res.json();
  return json.data.user;
}
