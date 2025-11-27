// src/modules/product/product.service.js
const productDao = require("./product.dao");

function normalizeProduct(payload) {
  return {
    name: String(payload.name).trim(),
    price: Number(payload.price),
    category: payload.category ? String(payload.category).trim() : "Khác",
    description: payload.description || "",
    image_url: payload.image_url || payload.imageUrl || "",
    is_active:
      payload.is_active !== undefined
        ? !!payload.is_active
        : payload.available !== undefined
        ? !!payload.available
        : true,
  };
}

async function getProducts(activeOnly) {
  return productDao.findAll({ activeOnly });
}

async function getProductById(id) {
  return productDao.findById(id);
}

async function createProduct(payload) {
  const product = normalizeProduct(payload);
  if (!product.name || Number.isNaN(product.price)) {
    const err = new Error("Tên và giá là bắt buộc");
    err.statusCode = 400;
    throw err;
  }
  return productDao.create(product);
}

async function updateProduct(id, payload) {
  const existing = await productDao.findById(id);
  if (!existing) {
    const err = new Error("Không tìm thấy sản phẩm");
    err.statusCode = 404;
    throw err;
  }

  const product = normalizeProduct({ ...existing, ...payload });
  return productDao.update(id, product);
}

async function deleteProduct(id) {
  return productDao.remove(id);
}

// Bulk import từ CSV / UI admin
async function bulkImport(list) {
  const normalized = list
    .map(normalizeProduct)
    .filter((p) => p.name && !Number.isNaN(p.price));

  if (!normalized.length) return 0;

  return productDao.bulkInsert(normalized);
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImport,
};
