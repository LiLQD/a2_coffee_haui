// src/modules/product/product.dao.js
const db = require("../../config/db");

// Lấy tất cả sản phẩm, join với categories để lấy tên danh mục
async function findAll({ activeOnly } = {}) {
  let sql = `
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.image_url,
      p.is_active,
      p.category_id,
      c.name AS category
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `;
  const params = [];

  if (activeOnly) {
    sql += " WHERE p.is_active = 1 AND c.is_active = 1";
  }

  sql += " ORDER BY p.created_at DESC";

  const [rows] = await db.query(sql, params);
  return rows;
}

async function findById(id) {
  const sql = `
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.image_url,
      p.is_active,
      p.category_id,
      c.name AS category
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `;
  const [rows] = await db.query(sql, [id]);
  return rows[0] || null;
}

async function create(product) {
  const { category_id, name, description, price, image_url, is_active } =
    product;

  const [result] = await db.query(
    `INSERT INTO products
      (category_id, name, description, price, image_url, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      category_id,
      name,
      description || "",
      price,
      image_url || "",
      is_active ? 1 : 0,
    ]
  );

  return { id: result.insertId, ...product };
}

async function update(id, product) {
  const { category_id, name, description, price, image_url, is_active } =
    product;

  await db.query(
    `UPDATE products
       SET category_id = ?,
           name = ?,
           description = ?,
           price = ?,
           image_url = ?,
           is_active = ?
     WHERE id = ?`,
    [
      category_id,
      name,
      description || "",
      price,
      image_url || "",
      is_active ? 1 : 0,
      id,
    ]
  );

  return { id, ...product };
}

async function remove(id) {
  await db.query("DELETE FROM products WHERE id = ?", [id]);
}

// Bulk insert: list đã có category_id, name, price,...
async function bulkInsert(products) {
  if (!products.length) return 0;

  const values = products.map((p) => [
    p.category_id,
    p.name,
    p.description || "",
    p.price,
    p.image_url || "",
    p.is_active ? 1 : 0,
  ]);

  const [result] = await db.query(
    `INSERT INTO products
      (category_id, name, description, price, image_url, is_active)
     VALUES ?`,
    [values]
  );

  return result.affectedRows;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  bulkInsert,
};
