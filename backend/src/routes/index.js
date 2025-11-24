// src/routes/index.js
const express = require("express");
const productRoutes = require("../modules/product/product.routes");

const router = express.Router();

// Gắn product service
router.use("/products", productRoutes);

// Có thể giữ route root để test
router.get("/", (req, res) => {
  res.json({ message: "API root" });
});

module.exports = router;
