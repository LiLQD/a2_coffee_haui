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
  // Có thể thêm validate đơn giản tại đây
  return productDao.updateById(id, data);
}

async function deleteProduct(id) {
  return productDao.softDeleteById(id);
}

module.exports = {
  getProducts,
  getProductsActiveOnly,
  getProductById,
  updateProduct,
  deleteProduct,
};
