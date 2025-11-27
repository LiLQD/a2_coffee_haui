// src/services/productApi.js
<<<<<<< HEAD
const API_BASE_URL = "http://localhost:3000/api";
=======
const API_BASE_URL = "http://localhost:3000/api";  // *** CHÚ Ý ***
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f

export async function fetchProducts(activeOnly = true) {
  const res = await fetch(
    `${API_BASE_URL}/products?activeOnly=${activeOnly ? "true" : "false"}`
  );

  if (!res.ok) {
<<<<<<< HEAD
    throw new Error(`Lỗi tải sản phẩm: HTTP ${res.status}`);
  }

  const json = await res.json(); // backend trả { success, data }
=======
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
  return json.data || [];
}
