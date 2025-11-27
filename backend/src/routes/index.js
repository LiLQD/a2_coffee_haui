// src/routes/index.js
const express = require("express");
const productRoutes = require("../modules/product/product.routes");

const router = express.Router();

router.use("/products", productRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
