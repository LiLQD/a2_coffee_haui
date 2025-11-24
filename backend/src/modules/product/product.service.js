// src/modules/product/product.service.js
const productDao = require("./product.dao");

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
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
