// src/routes/index.js
const express = require("express");
const productRoutes = require("../modules/product/product.routes");

const router = express.Router();

<<<<<<< HEAD
// Gắn product service
router.use("/products", productRoutes);

// Có thể giữ route root để test
router.get("/", (req, res) => {
  res.json({ message: "API root" });
=======
router.use("/products", productRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
});

module.exports = router;
