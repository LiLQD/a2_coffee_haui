// frontend/src/services/bulkImportApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Gửi danh sách sản phẩm (từ CSV) lên backend để import vào DB.
 * @param {Array} rows  - mảng object đã normalize từ CSV
 * @param {string} apiKey - admin API key
 */
export async function importProducts(rows, apiKey) {
  const res = await fetch(`${API_BASE_URL}/bulkimport/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-apikey": apiKey,
    },
    body: JSON.stringify({ products: rows }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text}`);
  }

  return res.json();
}
