// src/modules/category/category.routes.js
const express = require("express");
const controller = require("./category.controller");

const router = express.Router();

// /api/categories
router.get("/", controller.handleGetCategories);
router.get("/:id", controller.handleGetCategoryById);
router.post("/", controller.handleCreateCategory);
router.put("/:id", controller.handleUpdateCategory);
router.delete("/:id", controller.handleDeleteCategory);

module.exports = router;
