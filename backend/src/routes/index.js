// src/routes/index.js
const express = require("express");
const router = express.Router();

const productRoutes = require("../modules/product/product.routes");
const cartRoutes = require("../modules/cart/cart.routes");
const orderRoutes = require("../modules/order/order.routes"); // <-- THÊM DÒNG NÀY

// Health check
router.get("/health", (req, res) => {
  res.json({ message: "API root" });
});

// Product service
router.use("/products", productRoutes);

// Cart service
router.use("/cart", cartRoutes);

// Order service
router.use("/orders", orderRoutes); // <-- THÊM DÒNG NÀY

module.exports = router;
