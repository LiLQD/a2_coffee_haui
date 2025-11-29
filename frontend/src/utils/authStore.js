// frontend/src/utils/authStore.js

const STORAGE_KEY = "a2_user";

/**
 * Lưu thông tin user sau khi login
 * @param {Object|null} user
 *  Ví dụ:
 *  {
 *    id: 1,
 *    username: "admin",
 *    fullName: "Quản trị viên",
 *    role: "ADMIN",
 *    apiKey: "a2coffee-admin-secret"
 *  }
 */
export function setUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Không lưu được user vào localStorage:", err);
  }
}

/**
 * Lấy thông tin user hiện tại từ localStorage
 */
export function getUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Không đọc được user từ localStorage:", err);
    return null;
  }
}

/**
 * Xóa thông tin user (logout)
 */
export function clearUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Không xóa được user khỏi localStorage:", err);
  }
}

/**
 * Kiểm tra có phải admin hay không
 */
export function isAdmin() {
  const user = getUser();
  return !!user && user.role === "ADMIN";
}

/**
 * Lấy admin API key để gọi các API cần quyền admin (bulk import,...)
 */
export function getAdminApiKey() {
  const user = getUser();
  return user && user.apiKey ? user.apiKey : null;
}
