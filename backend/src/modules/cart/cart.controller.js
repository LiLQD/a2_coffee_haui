// src/modules/cart/cart.controller.js
const cartService = require("./cart.service");

// GET /api/cart/:userId
async function handleGetCart(req, res) {
  try {
    const userId = Number(req.params.userId);
    const result = await cartService.getCartForUser(userId);
    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
}

// POST /api/cart/add
// body: { userId, productId, quantity }
async function handleAddToCart(req, res) {
  try {
    const { userId, productId, quantity } = req.body;
    const result = await cartService.addToCart(
      Number(userId),
      Number(productId),
      Number(quantity) || 1
    );
    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
}

// PATCH /api/cart/item/:itemId
// body: { userId, quantity }
async function handleUpdateItem(req, res) {
  try {
    const itemId = Number(req.params.itemId);
    const { userId, quantity } = req.body;
    const result = await cartService.updateItemQuantity(
      Number(userId),
      itemId,
      Number(quantity)
    );
    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
}

// DELETE /api/cart/item/:itemId
// body: { userId }
async function handleDeleteItem(req, res) {
  try {
    const itemId = Number(req.params.itemId);
    const { userId } = req.body;
    const result = await cartService.removeItem(Number(userId), itemId);
    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
}

module.exports = {
  handleGetCart,
  handleAddToCart,
  handleUpdateItem,
  handleDeleteItem,
};
