// src/modules/cart/cart.service.js
const cartDao = require("./cart.dao");

async function getCartForUser(userId) {
  return cartDao.getCartDetail(userId);
}

async function addToCart(userId, productId, quantity = 1) {
  // 1. Tìm hoặc tạo cart ACTIVE
  let cart = await cartDao.findActiveCartByUser(userId);
  if (!cart) {
    cart = await cartDao.createCart(userId);
  }

  // 2. Lấy giá sản phẩm
  const price = await cartDao.getProductPrice(productId);
  if (!price) {
    const err = new Error("Product not found");
    err.statusCode = 400;
    throw err;
  }

  // 3. Upsert item
  const existing = await cartDao.findCartItem(cart.id, productId);
  if (existing) {
    const newQty = existing.quantity + quantity;
    await cartDao.updateCartItemQuantity(existing.id, newQty);
  } else {
    await cartDao.insertCartItem(cart.id, productId, quantity, price);
  }

  // 4. Trả lại giỏ mới nhất
  return cartDao.getCartDetail(userId);
}

async function updateItemQuantity(userId, itemId, quantity) {
  if (quantity <= 0) {
    return removeItem(userId, itemId);
  }
  await cartDao.updateCartItemQuantity(itemId, quantity);
  return cartDao.getCartDetail(userId);
}

async function removeItem(userId, itemId) {
  await cartDao.deleteCartItem(itemId);
  return cartDao.getCartDetail(userId);
}

module.exports = {
  getCartForUser,
  addToCart,
  updateItemQuantity,
  removeItem,
};
