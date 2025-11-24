// src/modules/product/product.routes.js
const express = require("express");
const controller = require("./product.controller");

const router = express.Router();

// Danh sách sản phẩm (có thể truyền ?activeOnly=true)
router.get("/", controller.handleGetProducts);

// Chi tiết 1 sản phẩm
router.get("/:id", controller.handleGetProductById);

// Tạo mới sản phẩm
router.post("/", controller.handleCreateProduct);

// Cập nhật sản phẩm
router.put("/:id", controller.handleUpdateProduct);

// Xoá sản phẩm
router.delete("/:id", controller.handleDeleteProduct);

module.exports = router;
