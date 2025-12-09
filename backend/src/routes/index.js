// src/routes/index.js
const express = require("express");

const productRoutes = require("../modules/product/product.routes");
const cartRoutes = require("../modules/cart/cart.routes");
const orderRoutes = require("../modules/order/order.routes");
const authRoutes = require("../modules/auth/auth.routes");
const bulkImportRoutes = require("../modules/bulkimport/bulkimport.routes");
const invoiceRoutes = require("../modules/invoice/invoice.routes");

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Auth
router.use("/auth", authRoutes);

// Product / Menu
router.use("/products", productRoutes);

// Cart
router.use("/cart", cartRoutes);

// Orders
router.use("/orders", orderRoutes);

// Bulk import (chỉ admin)
router.use("/bulkimport", bulkImportRoutes);

// Quản lý hóa đơn 
router.use("/invoices", invoiceRoutes);

// Root
router.get("/", (req, res) => {
  res.json({ message: "API root" });
});

module.exports = router;