// src/services/cartApi.js
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Tạm thời fix userId = 1 (sau này thay bằng id user khi đăng nhập)
export const FIXED_USER_ID = 1;

// Lấy giỏ hàng theo cartId (id giỏ, không phải userId)
export async function getCartById(cartId) {
  const res = await fetch(`${API_BASE_URL}/cart/${cartId}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data; // { cart, items }
}

// Thêm sản phẩm vào giỏ
export async function addToCart(productId, quantity = 1) {
  const res = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: FIXED_USER_ID,
      productId,
      quantity,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data; // { cart, items }
}

// Cập nhật số lượng 1 item
export async function updateCartItem(itemId, quantity) {
  const res = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: FIXED_USER_ID,
      quantity,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data; // { cart, items }
}

// Xoá 1 item khỏi giỏ
export async function removeCartItem(itemId) {
  const res = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: FIXED_USER_ID,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data; // { cart, items }
}
