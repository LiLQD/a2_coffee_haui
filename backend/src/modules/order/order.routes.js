// src/modules/order/order.routes.js
const express = require("express");
const {
  handleCreateOrder,
  handleGetOrderById,
  handleListOrders,
} = require("./order.controller");

const router = express.Router();

// Tạo đơn hàng
router.post("/", handleCreateOrder);

// Lấy danh sách đơn hàng (order history)
router.get("/", handleListOrders);

// Lấy chi tiết 1 đơn hàng
router.get("/:id", handleGetOrderById);

module.exports = router;
