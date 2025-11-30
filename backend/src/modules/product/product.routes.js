// backend/src/modules/product/product.routes.js
const express = require("express");
const router = express.Router();

const {
  handleGetProducts,
  handleGetProductById,
  handleUpdateProduct,
  handleDeleteProduct,
} = require("./product.controller");

const requireAdminApiKey = require("../../middlewares/requireAdminApiKey");

// Danh sách / chi tiết (public)
router.get("/", handleGetProducts);
router.get("/:id", handleGetProductById);

// Admin: sửa + xoá
router.put("/:id", requireAdminApiKey, handleUpdateProduct);
router.delete("/:id", requireAdminApiKey, handleDeleteProduct);

module.exports = router;
