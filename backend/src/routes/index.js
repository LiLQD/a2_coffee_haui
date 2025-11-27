const express = require("express");
const productRoutes = require("../modules/product/product.routes");
const categoryRoutes = require("../modules/category/category.routes");
const cartRoutes = require("../modules/cart/cart.routes");

const router = express.Router();

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);

// route test
router.get("/", (req, res) => {
  res.json({ message: "API root" });
});

module.exports = router;
