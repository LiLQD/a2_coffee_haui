// src/modules/category/category.controller.js
const categoryService = require("./category.service");

async function handleGetCategories(req, res, next) {
  try {
    const activeOnly = req.query.activeOnly === "true";
    const list = await categoryService.getCategories(activeOnly);
    res.json({ data: list });
  } catch (err) {
    next(err);
  }
}

async function handleGetCategoryById(req, res, next) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.json({ data: category });
  } catch (err) {
    next(err);
  }
}

async function handleCreateCategory(req, res, next) {
  try {
    const created = await categoryService.createCategory(req.body);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

async function handleUpdateCategory(req, res, next) {
  try {
    const updated = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

async function handleDeleteCategory(req, res, next) {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetCategories,
  handleGetCategoryById,
  handleCreateCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};
