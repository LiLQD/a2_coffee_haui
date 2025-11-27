// src/modules/product/product.routes.js
const express = require("express");
const controller = require("./product.controller");

const router = express.Router();

// /api/products
router.get("/", controller.handleGetProducts);

// Bulk import: POST /api/products/bulk
router.post("/bulk", controller.handleBulkImport);

// Các route theo id
router.get("/:id", controller.handleGetProductById);
router.post("/", controller.handleCreateProduct);
router.put("/:id", controller.handleUpdateProduct);
router.delete("/:id", controller.handleDeleteProduct);

module.exports = router;
