// backend/src/modules/product/product.controller.js
const productService = require("./product.service");

// GET /api/products?activeOnly=true|false
async function handleGetProducts(req, res, next) {
  try {
    const activeOnly = req.query.activeOnly === "true";
    const data = await productService.getProducts(activeOnly);
    res.json({ data });
  } catch (err) {
    console.error("handleGetProducts error:", err);
    next(err);
  }
}

// GET /api/products/:id
async function handleGetProductById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
    }
    res.json({ data: product });
  } catch (err) {
    console.error("handleGetProductById error:", err);
    next(err);
  }
}

// PUT /api/products/:id  (admin)
async function handleUpdateProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const payload = req.body || {};

    const updated = await productService.updateProduct(id, payload);
    if (!updated) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
    }

    res.json({ data: updated });
  } catch (err) {
    console.error("handleUpdateProduct error:", err);
    next(err);
  }
}

// DELETE /api/products/:id (admin)
// Query: ?type=hard (xóa vĩnh viễn) hoặc mặc định soft (ẩn đi)
async function handleDeleteProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const type = req.query.type; // 'hard' or other
    await productService.deleteProduct(id, type);
    res.json({ data: { success: true } });
  } catch (err) {
    console.error("handleDeleteProduct error:", err);
    next(err);
  }
}

module.exports = {
  handleGetProducts,
  handleGetProductById,
  handleUpdateProduct,
  handleDeleteProduct,
};
