// src/modules/order/order.routes.js
const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");

// POST /api/orders  -> tạo đơn hàng
router.post("/", orderController.handleCreateOrder);

// GET /api/orders?userId=&status= -> list đơn
router.get("/", orderController.handleListOrders);

// GET /api/orders/:id -> chi tiết 1 đơn
router.get("/:id", orderController.handleGetOrder);

module.exports = router;
