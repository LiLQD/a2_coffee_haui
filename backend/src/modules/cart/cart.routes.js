// src/modules/cart/cart.routes.js
const express = require("express");
const {
  handleGetCart,
  handleAddToCart,
  handleUpdateItem,
  handleDeleteItem,
} = require("./cart.controller");

const router = express.Router();

// GET /api/cart/:userId
router.get("/:userId", handleGetCart);

// POST /api/cart/add
router.post("/add", handleAddToCart);

// PATCH /api/cart/item/:itemId
router.patch("/item/:itemId", handleUpdateItem);

// DELETE /api/cart/item/:itemId
router.delete("/item/:itemId", handleDeleteItem);

module.exports = router;
