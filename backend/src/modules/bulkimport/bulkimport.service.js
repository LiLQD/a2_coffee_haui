const db = require("../../config/db");
const productService = require("../product/product.service");

// Helper: Cache danh mục để tránh query nhiều lần
const categoryCache = {};

async function getOrCreateCategory(conn, name) {
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

/**
 * Xử lý import:
 * - Nếu tên trùng -> Update
 * - Nếu chưa có -> Insert
 */
async function importProducts(items) {
  const conn = await db.getConnection();
  let insertedCount = 0;
  let updatedCount = 0;
  const errors = [];

  try {
    await conn.beginTransaction();

    const DEFAULT_IMAGE = "default_food.jpg";

    for (const item of items) {
      const name = (item.name || "").trim();
      const price = Number(item.price || 0);
      const categoryName = (item.category || "Khác").trim();
      const description = (item.description || "").trim();
      const imageUrl = (item.image_url || "").trim() || DEFAULT_IMAGE;

      let isActive = item.is_active;
      if (typeof isActive === "string") {
        const norm = isActive.toLowerCase();
        isActive = norm === "true" || norm === "1" || norm === "yes";
      } else {
        isActive = Boolean(isActive);
      }

      if (!name || isNaN(price)) {
        errors.push(`Sản phẩm "${name || 'Không tên'}" lỗi dữ liệu.`);
        continue;
      }

      // Lấy category ID
      const categoryId = await getOrCreateCategory(conn, categoryName);

      // Check tồn tại (dùng conn của transaction này hoặc pool chung? 
      // DAO dùng pool chung. Để an toàn trong transaction, ta nên query trực tiếp hoặc pass conn vào DAO.
      // Tuy nhiên product.service dùng DAO pool. 
      // Để đơn giản và đúng SOA, ta check bằng service (pool chung) trước.
      // Lưu ý: Nếu transaction đang lock table thì pool chung có thể bị block nếu cùng record.
      // Nhưng ở đây ta đang dùng conn transaction cho việc INSERT/UPDATE thì tốt hơn.
      // Tạm thời để giữ đúng SOA, ta dùng query trực tiếp trong service này cho phần transaction, 
      // hoặc phải sửa DAO để nhận connection ngoài.
      // Cách nhanh nhất và an toàn: Query check duplicate bằng conn transaction.

      const [existing] = await conn.query("SELECT id FROM products WHERE name = ?", [name]);

      if (existing.length > 0) {
        // UPDATE
        const productId = existing[0].id;
        await conn.query(
          `UPDATE products 
           SET category_id=?, description=?, price=?, image_url=?, is_active=?
           WHERE id=?`,
          [categoryId, description, price, imageUrl, isActive ? 1 : 0, productId]
        );
        updatedCount++;
      } else {
        // INSERT
        await conn.query(
          `INSERT INTO products
           (category_id, name, description, price, image_url, is_active)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [categoryId, name, description, price, imageUrl, isActive ? 1 : 0]
        );
        insertedCount++;
      }
    }

    await conn.commit();

    return {
      success: true,
      insertedCount,
      updatedCount,
      errors
    };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function resetProductIds() {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [products] = await conn.query("SELECT * FROM products ORDER BY id ASC");
    if (products.length === 0) {
      await conn.commit();
      return { message: "Không có sản phẩm nào để reset" };
    }

    await conn.query("DROP TABLE IF EXISTS products_temp");
    await conn.query(`CREATE TABLE products_temp LIKE products`);
    await conn.query("ALTER TABLE products_temp AUTO_INCREMENT = 1");

    for (const product of products) {
      await conn.query(
        `INSERT INTO products_temp 
         (category_id, name, description, price, image_url, is_active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          product.category_id,
          product.name,
          product.description,
          product.price,
          product.image_url,
          product.is_active,
          product.created_at,
        ]
      );
    }

    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.query("DROP TABLE products");
    await conn.query("RENAME TABLE products_temp TO products");
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    await conn.commit();
    return { success: true };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  importProducts,
  resetProductIds
};
