// backend/src/modules/bulkimport/bulkimport.controller.js

const db = require("../../config/db"); // <── FIX ĐƯỜNG DẪN

/**
 * POST /api/bulkimport/products
 */
async function handleBulkImportProducts(req, res) {
  try {
    const items = req.body?.products;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "File CSV không có dữ liệu hợp lệ.",
      });
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Cache tên danh mục -> id
      const categoryCache = {};

      async function getOrCreateCategory(name) {
        if (!name) throw new Error("Thiếu tên danh mục");
        if (categoryCache[name]) return categoryCache[name];

        const [rows] = await conn.query(
          "SELECT id FROM categories WHERE name = ? LIMIT 1",
          [name]
        );
        if (rows.length > 0) {
          categoryCache[name] = rows[0].id;
          return rows[0].id;
        }

        const [result] = await conn.query(
          "INSERT INTO categories (name, description, is_active) VALUES (?, ?, 1)",
          [name, `Danh mục tự tạo khi import: ${name}`]
        );

        categoryCache[name] = result.insertId;
        return result.insertId;
      }

      let insertedCount = 0;

      for (const item of items) {
        const name = (item.name || "").trim();
        const price = Number(item.price || 0);
        const categoryName = (item.category || "Khác").trim();
        const description = (item.description || "").trim();
        const imageUrl = (item.image_url || "").trim();
        let isActive = item.is_active;

        if (!name || !price || Number.isNaN(price)) continue;

        if (typeof isActive === "string") {
          const norm = isActive.toLowerCase();
          isActive = norm === "true" || norm === "1" || norm === "yes";
        } else {
          isActive = Boolean(isActive);
        }

        const categoryId = await getOrCreateCategory(categoryName);

        await conn.query(
          `INSERT INTO products
           (category_id, name, description, price, image_url, is_active)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [categoryId, name, description, price, imageUrl, isActive ? 1 : 0]
        );

        insertedCount++;
      }

      await conn.commit();

      // Lấy lại danh sách để hiển thị
      const [rows] = await db.query(`
        SELECT p.id, p.name, p.price, p.image_url, p.is_active,
               c.name AS category
        FROM products p
        JOIN categories c ON p.category_id = c.id
        ORDER BY p.id ASC
      `);

      return res.json({
        data: {
          inserted: insertedCount,
          products: rows,
        },
      });
    } catch (err) {
      await conn.rollback();
      console.error("Bulk import rollback error:", err);
      return res.status(500).json({
        error: "Lỗi khi import dữ liệu.",
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Bulk import controller crash:", err);
    return res.status(500).json({
      error: "Lỗi server.",
    });
  }
}

module.exports = { handleBulkImportProducts };
