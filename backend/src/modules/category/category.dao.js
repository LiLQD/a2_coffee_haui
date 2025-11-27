// src/modules/category/category.dao.js
const db = require("../../config/db");

// Lấy tất cả categories
async function findAll({ activeOnly } = {}) {
  let sql =
    "SELECT id, name, description, is_active, created_at FROM categories";
  const params = [];

  if (activeOnly) {
    sql += " WHERE is_active = 1";
  }

  const [rows] = await db.query(sql, params);
  return rows;
}

async function findById(id) {
  const [rows] = await db.query(
    "SELECT id, name, description, is_active, created_at FROM categories WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function findByName(name) {
  const [rows] = await db.query(
    "SELECT id, name, description, is_active, created_at FROM categories WHERE name = ?",
    [name]
  );
  return rows[0] || null;
}

async function create(category) {
  const { name, description, is_active } = category;

  const [result] = await db.query(
    `INSERT INTO categories (name, description, is_active)
     VALUES (?, ?, ?)`,
    [name, description || null, is_active ? 1 : 0]
  );

  return { id: result.insertId, ...category };
}

async function update(id, category) {
  const { name, description, is_active } = category;

  await db.query(
    `UPDATE categories
       SET name = ?, description = ?, is_active = ?
     WHERE id = ?`,
    [name, description || null, is_active ? 1 : 0, id]
  );

  return { id, ...category };
}

async function remove(id) {
  await db.query("DELETE FROM categories WHERE id = ?", [id]);
}

module.exports = {
  findAll,
  findById,
  findByName,
  create,
  update,
  remove,
};
