// src/modules/product/product.dao.js
const db = require("../../config/db");

<<<<<<< HEAD
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
=======
// Lấy tất cả sản phẩm, optional filter activeOnly
async function findAll({ activeOnly } = {}) {
  let sql = "SELECT id, name, price, category, description, image_url, is_active FROM products";
  const params = [];

  if (activeOnly) {
    sql += " WHERE is_active = 1";
  }

  const [rows] = await db.query(sql, params);
  return rows;
}

async function findById(id) {
  const [rows] = await db.query(
    "SELECT id, name, price, category, description, image_url, is_active FROM products WHERE id = ?",
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
    [id]
  );
  return rows[0] || null;
}

<<<<<<< HEAD
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
=======
async function create(product) {
  const { name, price, category, description, image_url, is_active } = product;

  const [result] = await db.query(
    `INSERT INTO products (name, price, category, description, image_url, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, price, category, description || "", image_url || "", is_active ? 1 : 0]
  );

  return { id: result.insertId, ...product };
}

async function update(id, product) {
  const { name, price, category, description, image_url, is_active } = product;

  await db.query(
    `UPDATE products
       SET name = ?, price = ?, category = ?, description = ?, image_url = ?, is_active = ?
     WHERE id = ?`,
    [name, price, category, description || "", image_url || "", is_active ? 1 : 0, id]
  );

  return { id, ...product };
}

async function remove(id) {
  await db.query("DELETE FROM products WHERE id = ?", [id]);
}

// Bulk insert: nhận 1 mảng sản phẩm
async function bulkInsert(products) {
  if (!products.length) return 0;

  const values = products.map((p) => [
    p.name,
    p.price,
    p.category,
    p.description || "",
    p.image_url || "",
    p.is_active ? 1 : 0,
  ]);

  const [result] = await db.query(
    `INSERT INTO products (name, price, category, description, image_url, is_active)
     VALUES ?`,
    [values]
  );

  return result.affectedRows;
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
}

module.exports = {
  findAll,
<<<<<<< HEAD
  findAllActive,
=======
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
  findById,
  create,
  update,
  remove,
<<<<<<< HEAD
=======
  bulkInsert,
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
};
