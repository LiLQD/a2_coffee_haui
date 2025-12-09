// backend/src/modules/product/product.dao.js
const pool = require("../../config/db");

// Lấy danh sách sản phẩm (có thể lọc theo activeOnly)
async function findAll({ activeOnly } = {}) {
  const where = activeOnly ? "WHERE p.is_active = 1" : "";
  const [rows] = await pool.query(
    `
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
    ${where}
    ORDER BY p.id ASC
    `
  );
  return rows;
}

// Hàm cũ dùng ở HomePage – giữ lại cho tương thích
async function findAllActive() {
  return findAll({ activeOnly: true });
}

async function findById(id) {
  const [rows] = await pool.query(
    `
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
    `,
    [id]
  );
  return rows[0] || null;
}

// Tạo sản phẩm (dùng cho bulk import nếu muốn)
async function create(product) {
  const {
    name,
    description,
    price,
    image_url,
    category_id,
    is_active = 1,
  } = product;

  const [result] = await pool.query(
    `
    INSERT INTO products (name, description, price, image_url, category_id, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, description, price, image_url, category_id, is_active]
  );

  return findById(result.insertId);
}

// Cập nhật 1 sản phẩm theo id (chỉ update field được truyền)
async function updateById(id, data) {
  const fields = [];
  const params = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    params.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push("description = ?");
    params.push(data.description);
  }
  if (data.price !== undefined) {
    fields.push("price = ?");
    params.push(data.price);
  }
  if (data.image_url !== undefined) {
    fields.push("image_url = ?");
    params.push(data.image_url);
  }
  if (data.category_id !== undefined) {
    fields.push("category_id = ?");
    params.push(data.category_id);
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?");
    params.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) {
    // Không có gì để update
    return findById(id);
  }

  params.push(id);

  await pool.query(
    `
    UPDATE products
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
    params
  );

  return findById(id);
}

// "Xoá mềm" – set is_active = 0 để không vướng khoá ngoại
async function softDeleteById(id) {
  await pool.query(
    `
    UPDATE products
    SET is_active = 0
    WHERE id = ?
    `,
    [id]
  );
  return { success: true };
}

// "Xoá cứng" - Xóa hoàn toàn khỏi database
async function hardDeleteById(id) {
  await pool.query(
    "DELETE FROM products WHERE id = ?",
    [id]
  );
  return { success: true };
}

// Tìm theo tên (để check trùng)
async function findByName(name) {
  const [rows] = await pool.query(
    "SELECT * FROM products WHERE name = ? LIMIT 1",
    [name]
  );
  return rows[0] || null;
}

module.exports = {
  findAll,
  findAllActive,
  findById,
  findByName,
  create,
  updateById,
  softDeleteById,
  hardDeleteById,
};
