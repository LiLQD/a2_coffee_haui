// src/modules/cart/cart.dao.js
const pool = require("../../config/db");

// Tìm giỏ ACTIVE của user
async function findActiveCartByUser(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM carts WHERE user_id = ? AND status = 'ACTIVE' LIMIT 1",
    [userId]
  );
  return rows[0] || null;
}

// Tạo giỏ mới cho user
async function createCart(userId) {
  const [result] = await pool.query(
    "INSERT INTO carts (user_id, status) VALUES (?, 'ACTIVE')",
    [userId]
  );
  const [rows] = await pool.query("SELECT * FROM carts WHERE id = ?", [
    result.insertId,
  ]);
  return rows[0];
}

// Tìm 1 item trong giỏ theo product
async function findCartItem(cartId, productId) {
  const [rows] = await pool.query(
    "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1",
    [cartId, productId]
  );
  return rows[0] || null;
}

// Thêm mới item
async function insertCartItem(cartId, productId, quantity, unitPrice) {
  const [result] = await pool.query(
    "INSERT INTO cart_items (cart_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
    [cartId, productId, quantity, unitPrice]
  );
  const [rows] = await pool.query("SELECT * FROM cart_items WHERE id = ?", [
    result.insertId,
  ]);
  return rows[0];
}

// Cập nhật số lượng item
async function updateCartItemQuantity(itemId, quantity) {
  await pool.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [
    quantity,
    itemId,
  ]);
}

// Xoá item
async function deleteCartItem(itemId) {
  await pool.query("DELETE FROM cart_items WHERE id = ?", [itemId]);
}

// Lấy chi tiết giỏ (items + thông tin product)
async function getCartDetail(userId) {
  const [carts] = await pool.query(
    "SELECT * FROM carts WHERE user_id = ? AND status = 'ACTIVE' LIMIT 1",
    [userId]
  );
  const cart = carts[0];
  if (!cart) return { cart: null, items: [] };

  const [items] = await pool.query(
    `
    SELECT ci.id,
           ci.product_id,
           ci.quantity,
           ci.unit_price,
           p.name,
           p.description,
           p.image_url
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = ?
    ORDER BY ci.id DESC
  `,
    [cart.id]
  );

  return { cart, items };
}

// Lấy giá sản phẩm (để làm unit_price)
async function getProductPrice(productId) {
  const [rows] = await pool.query(
    "SELECT price FROM products WHERE id = ?",
    [productId]
  );
  return rows[0] ? rows[0].price : null;
}

module.exports = {
  findActiveCartByUser,
  createCart,
  findCartItem,
  insertCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  getCartDetail,
  getProductPrice,
};
