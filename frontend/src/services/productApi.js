// src/services/productApi.js
const API_BASE_URL = "http://localhost:3000/api";  // *** CHÚ Ý ***

export async function fetchProducts(activeOnly = true) {
  const res = await fetch(
    `${API_BASE_URL}/products?activeOnly=${activeOnly ? "true" : "false"}`
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || [];
}
