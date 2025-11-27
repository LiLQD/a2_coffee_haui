// src/modules/product/product.service.js
const productDao = require("./product.dao");
const categoryDao = require("../category/category.dao");

function baseNormalize(payload) {
  const name = String(payload.name || "").trim();
  const price = Number(payload.price);

  if (!name || Number.isNaN(price)) {
    const err = new Error("Tên và giá sản phẩm là bắt buộc");
    err.statusCode = 400;
    throw err;
  }

  return {
    name,
    description: payload.description || "",
    price,
    image_url: payload.image_url || payload.imageUrl || "",
    is_active:
      payload.is_active !== undefined
        ? !!payload.is_active
        : payload.available !== undefined
        ? !!payload.available
        : true,
  };
}

async function resolveCategoryId(payload) {
  // Ưu tiên category_id nếu có
  if (payload.category_id) {
    return Number(payload.category_id);
  }
  // Nếu có tên category (CSV / UI)
  if (payload.category) {
    const name = String(payload.category).trim();
    if (!name) return null;

    // cache/memoization có thể thêm sau, tuỳ nhu cầu
    let cat = await categoryDao.findByName(name);
    if (!cat) {
      cat = await categoryDao.create({
        name,
        description: "",
        is_active: 1,
      });
    }
    return cat.id;
  }
  return null;
}

async function getProducts(activeOnly) {
  return productDao.findAll({ activeOnly });
}

async function getProductById(id) {
  return productDao.findById(id);
}

async function createProduct(payload) {
  const base = baseNormalize(payload);
  const category_id = await resolveCategoryId(payload);

  if (!category_id) {
    const err = new Error("Thiếu danh mục (category hoặc category_id)");
    err.statusCode = 400;
    throw err;
  }

  const product = {
    category_id,
    ...base,
  };

  return productDao.create(product);
}

async function updateProduct(id, payload) {
  const existing = await productDao.findById(id);
  if (!existing) {
    const err = new Error("Không tìm thấy sản phẩm");
    err.statusCode = 404;
    throw err;
  }

  const base = baseNormalize({ ...existing, ...payload });
  let category_id = existing.category_id;

  // Cho phép đổi category qua category_id hoặc category name
  const resolvedCategoryId = await resolveCategoryId(payload);
  if (resolvedCategoryId) {
    category_id = resolvedCategoryId;
  }

  const product = { category_id, ...base };
  return productDao.update(id, product);
}

async function deleteProduct(id) {
  return productDao.remove(id);
}

// Bulk import từ CSV / UI admin
async function bulkImport(list) {
  if (!Array.isArray(list) || !list.length) return 0;

  const cache = {}; // map categoryName -> category_id
  const rows = [];

  for (const raw of list) {
    try {
      const base = baseNormalize(raw);

      let categoryName =
        raw.category && String(raw.category).trim().length > 0
          ? String(raw.category).trim()
          : "Khác";

      let category_id = raw.category_id ? Number(raw.category_id) : null;

      if (!category_id) {
        if (!cache[categoryName]) {
          let cat = await categoryDao.findByName(categoryName);
          if (!cat) {
            cat = await categoryDao.create({
              name: categoryName,
              description: "",
              is_active: 1,
            });
          }
          cache[categoryName] = cat.id;
        }
        category_id = cache[categoryName];
      }

      rows.push({
        category_id,
        ...base,
      });
    } catch (e) {
      // nếu 1 dòng CSV lỗi (thiếu name/price), bỏ qua
      console.warn("Bỏ qua dòng import lỗi:", e.message);
    }
  }

  if (!rows.length) return 0;
  return productDao.bulkInsert(rows);
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImport,
};
