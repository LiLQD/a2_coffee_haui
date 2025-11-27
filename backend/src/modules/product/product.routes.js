// src/modules/product/product.routes.js
const express = require("express");
const controller = require("./product.controller");

const router = express.Router();

<<<<<<< HEAD
// Danh sách sản phẩm (có thể truyền ?activeOnly=true)
router.get("/", controller.handleGetProducts);

// Chi tiết 1 sản phẩm
router.get("/:id", controller.handleGetProductById);

// Tạo mới sản phẩm
router.post("/", controller.handleCreateProduct);

// Cập nhật sản phẩm
router.put("/:id", controller.handleUpdateProduct);

// Xoá sản phẩm
=======
// /api/products
router.get("/", controller.handleGetProducts);

// Bulk import: POST /api/products/bulk
router.post("/bulk", controller.handleBulkImport);

// Các route theo id
router.get("/:id", controller.handleGetProductById);
router.post("/", controller.handleCreateProduct);
router.put("/:id", controller.handleUpdateProduct);
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
router.delete("/:id", controller.handleDeleteProduct);

module.exports = router;
