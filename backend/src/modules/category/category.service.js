// src/modules/category/category.service.js
const categoryDao = require("./category.dao");

function normalize(payload) {
  const name = String(payload.name || "").trim();
  if (!name) {
    const err = new Error("Tên danh mục là bắt buộc");
    err.statusCode = 400;
    throw err;
  }

  return {
    name,
    description: payload.description || "",
    is_active:
      payload.is_active !== undefined ? !!payload.is_active : true,
  };
}

async function getCategories(activeOnly) {
  return categoryDao.findAll({ activeOnly });
}

async function getCategoryById(id) {
  return categoryDao.findById(id);
}

async function createCategory(payload) {
  const category = normalize(payload);

  const existing = await categoryDao.findByName(category.name);
  if (existing) {
    const err = new Error("Danh mục đã tồn tại");
    err.statusCode = 409;
    throw err;
  }

  return categoryDao.create(category);
}

async function updateCategory(id, payload) {
  const existing = await categoryDao.findById(id);
  if (!existing) {
    const err = new Error("Không tìm thấy danh mục");
    err.statusCode = 404;
    throw err;
  }

  const category = normalize({ ...existing, ...payload });
  return categoryDao.update(id, category);
}

async function deleteCategory(id) {
  return categoryDao.remove(id);
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
