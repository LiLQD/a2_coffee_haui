// src/utils/authStore.js

const STORAGE_KEY = "a2_user";

/**
 * Lưu user sau khi login
 */
export function saveUser(user) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn("Không lưu được user vào localStorage", e);
  }
}

/**
 * Lấy user hiện tại (hoặc null)
 */
export function getUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Lấy userId hiện tại, fallback = 1 cho demo
 */
export function getUserId() {
  const user = getUser();
  return user?.id || 1;
}

/**
 * Xoá thông tin user (khi logout)
 */
export function clearUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
