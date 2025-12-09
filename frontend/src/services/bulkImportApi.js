// frontend/src/services/bulkImportApi.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function importProducts(rows, adminApiKey) {
  const resp = await fetch(`${API_BASE_URL}/bulkimport/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-apikey": adminApiKey,  // ✅ Giữ nguyên
    },
    body: JSON.stringify({ products: rows }),
  });

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} ${text}`);
  }
  return JSON.parse(text);
}

export async function updateProduct(id, payload, adminApiKey) {
  const resp = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-apikey": adminApiKey,  // ✅ ĐÚNG RỒI
    },
    body: JSON.stringify(payload),
  });

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} ${text}`);
  }
  return JSON.parse(text);
}

// type: 'hard' | 'soft' (def)
export async function deleteProduct(id, type, adminApiKey) {
  let url = `${API_BASE_URL}/products/${id}`;
  if (type) {
    url += `?type=${type}`;
  }

  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      "x-admin-apikey": adminApiKey,
    },
  });

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} ${text}`);
  }
  return JSON.parse(text);
}