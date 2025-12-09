// backend/src/modules/product/product.service.js
const productDao = require("./product.dao");

async function getProducts(activeOnly = false) {
  return productDao.findAll({ activeOnly });
}

async function getProductsActiveOnly() {
  return productDao.findAllActive();
}

async function getProductById(id) {
  return productDao.findById(id);
}

async function updateProduct(id, data) {
  // Check trùng tên nếu có đổi tên
  if (data.name) {
    const existing = await productDao.findByName(data.name);
    if (existing && existing.id !== id) {
      throw new Error("Tên sản phẩm đã tồn tại");
    }
  }
  return productDao.updateById(id, data);
}

async function deleteProduct(id, type) {
  if (type === "hard") {
    try {
      return await productDao.hardDeleteById(id);
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2' || (error.message && error.message.includes('foreign key constraint fails'))) {
        throw new Error("Không thể xóa vĩnh viễn sản phẩm đã có trong đơn hàng. Vui lòng chọn 'Ẩn' thay thế.");
      }
      throw error;
    }
  }
  return productDao.softDeleteById(id);
}

async function createProduct(data) {
  // Check trùng tên
  if (data.name) {
    const existing = await productDao.findByName(data.name);
    if (existing) {
      throw new Error("Tên sản phẩm đã tồn tại");
    }
  }
  return productDao.create(data);
}

async function findByName(name) {
  return productDao.findByName(name);
}

module.exports = {
  getProducts,
  getProductsActiveOnly,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
  findByName,
};
