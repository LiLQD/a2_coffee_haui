// src/modules/bulkimport/bulkimport.service.js
const pool = require("../../config/db");

/**
 * Import nhiều sản phẩm từ mảng rows:
 * rows = [
 *   { name, price, category, description, imageUrl, available }
 * ]
 */
async function importProductsBulk(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    const err = new Error("NO_DATA");
    err.status = 400;
    throw err;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Lưu cache category name -> id để khỏi query lặp lại
    const categoryCache = new Map();

    async function getCategoryIdByName(name) {
      const key = name || "Khác";
      if (categoryCache.has(key)) return categoryCache.get(key);

      // Tìm category theo name
      const [rows] = await conn.query(
        "SELECT id FROM categories WHERE name = ? LIMIT 1",
        [key]
      );

      let categoryId;
      if (rows.length) {
        categoryId = rows[0].id;
      } else {
        // Nếu chưa có, tạo mới
        const [result] = await conn.query(
          "INSERT INTO categories (name, description, is_active) VALUES (?, ?, 1)",
          [key, `Tạo tự động từ import`, 1]
        );
        categoryId = result.insertId;
      }

      categoryCache.set(key, categoryId);
      return categoryId;
    }

    let insertedCount = 0;

    for (const row of rows) {
      const name = (row.name || "").trim();
      if (!name) continue;

      const price = Number(row.price) || 0;
      if (price <= 0) continue;

      const categoryName = (row.category || "Khác").trim();
      const description = (row.description || "").trim();
      const imageUrl = row.imageUrl || row.image_url || null;
      const availableStr = String(row.available ?? "true").toLowerCase();
      const isActive =
        availableStr === "true" || availableStr === "1" ? 1 : 0;

      const categoryId = await getCategoryIdByName(categoryName);

      await conn.query(
        `
        INSERT INTO products
          (category_id, name, description, price, image_url, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [categoryId, name, description, price, imageUrl, isActive]
      );

      insertedCount++;
    }

    await conn.commit();

    return {
      inserted: insertedCount,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  importProductsBulk,
};
