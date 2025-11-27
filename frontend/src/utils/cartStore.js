// src/utils/cartStore.js
const STORAGE_KEY = "a2_cart";

export function getCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("getCart error:", e);
    return [];
  }
}

export function setCart(cart) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("setCart error:", e);
  }
}

export function clearCart() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("clearCart error:", e);
  }
}
