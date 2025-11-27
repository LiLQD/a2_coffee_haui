// src/modules/product/product.service.js
const productDao = require("./product.dao");

<<<<<<< HEAD
// Lấy danh sách sản phẩm (tùy chọn chỉ lấy active)
async function getProducts(options = {}) {
  const { activeOnly = false } = options;

  if (activeOnly) {
    return productDao.findAllActive();
  }
  return productDao.findAll();
}

// Lấy chi tiết 1 sản phẩm
async function getProductById(id) {
  const product = await productDao.findById(id);
  if (!product) {
    const error = new Error("Không tìm thấy sản phẩm");
    error.status = 404;
    throw error;
  }
  return product;
}

// Tạo mới sản phẩm
async function createProduct(payload) {
  // Validate tối thiểu
  if (!payload.name || payload.name.trim() === "") {
    const error = new Error("Tên sản phẩm không được để trống");
    error.status = 400;
    throw error;
  }

  if (payload.price == null || isNaN(Number(payload.price))) {
    const error = new Error("Giá sản phẩm không hợp lệ");
    error.status = 400;
    throw error;
  }

  const productToCreate = {
    name: payload.name.trim(),
    description: payload.description || "",
    price: Number(payload.price),
    image_url: payload.image_url || null,
    is_active: payload.is_active != null ? Number(payload.is_active) : 1,
    category_id: payload.category_id || null,
  };

  return productDao.create(productToCreate);
}

// Cập nhật sản phẩm
async function updateProduct(id, payload) {
  const existing = await productDao.findById(id);
  if (!existing) {
    const error = new Error("Không tìm thấy sản phẩm để cập nhật");
    error.status = 404;
    throw error;
  }

  const productToUpdate = {
    name: payload.name != null ? payload.name : existing.name,
    description: payload.description != null ? payload.description : existing.description,
    price: payload.price != null ? Number(payload.price) : existing.price,
    image_url: payload.image_url != null ? payload.image_url : existing.image_url,
    is_active: payload.is_active != null ? Number(payload.is_active) : existing.is_active,
    category_id: payload.category_id != null ? payload.category_id : existing.category_id,
  };

  return productDao.update(id, productToUpdate);
}

// Xoá sản phẩm
async function deleteProduct(id) {
  const existing = await productDao.findById(id);
  if (!existing) {
    const error = new Error("Không tìm thấy sản phẩm để xoá");
    error.status = 404;
    throw error;
  }
  await productDao.remove(id);
  return;
=======
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
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
<<<<<<< HEAD
=======
  bulkImport,
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
};
