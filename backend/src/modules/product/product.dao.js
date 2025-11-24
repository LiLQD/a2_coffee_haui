// src/modules/product/product.dao.js
const db = require("../../config/db");

// Lấy tất cả sản phẩm (bao gồm cả is_active = 0 nếu cần)
async function findAll() {
  const [rows] = await db.query(
    `SELECT id, name, description, price, image_url, is_active, category_id
     FROM products`
  );
  return rows;
}

// Lấy tất cả sản phẩm đang bật (is_active = 1)
async function findAllActive() {
  const [rows] = await db.query(
    `SELECT id, name, description, price, image_url, is_active, category_id
     FROM products
     WHERE is_active = 1`
  );
  return rows;
}

// Lấy 1 sản phẩm theo id
async function findById(id) {
  const [rows] = await db.query(
    `SELECT id, name, description, price, image_url, is_active, category_id
     FROM products
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

// Thêm sản phẩm mới
async function create(product) {
  const { name, description, price, image_url, is_active, category_id } = product;

  const [result] = await db.query(
    `INSERT INTO products (name, description, price, image_url, is_active, category_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, image_url, is_active, category_id]
  );

  // Trả về bản ghi vừa tạo
  return findById(result.insertId);
}

// Cập nhật sản phẩm
async function update(id, product) {
  const { name, description, price, image_url, is_active, category_id } = product;

  await db.query(
    `UPDATE products
     SET name = ?, description = ?, price = ?, image_url = ?, is_active = ?, category_id = ?
     WHERE id = ?`,
    [name, description, price, image_url, is_active, category_id, id]
  );

  return findById(id);
}

// Xoá sản phẩm
async function remove(id) {
  await db.query(`DELETE FROM products WHERE id = ?`, [id]);
}

module.exports = {
  findAll,
  findAllActive,
  findById,
  create,
  update,
  remove,
};
