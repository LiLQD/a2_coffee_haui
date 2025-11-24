// src/services/productApi.js
const API_BASE_URL = "http://localhost:3000/api";

export async function fetchProducts(activeOnly = true) {
  const res = await fetch(
    `${API_BASE_URL}/products?activeOnly=${activeOnly ? "true" : "false"}`
  );

  if (!res.ok) {
    throw new Error(`Lỗi tải sản phẩm: HTTP ${res.status}`);
  }

  const json = await res.json(); // backend trả { success, data }
  return json.data || [];
}
