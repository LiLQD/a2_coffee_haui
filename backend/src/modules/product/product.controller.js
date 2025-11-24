// src/modules/product/product.controller.js
const productService = require("./product.service");

// GET /api/products?activeOnly=true
async function handleGetProducts(req, res) {
  try {
    const activeOnly = req.query.activeOnly === "true";
    const products = await productService.getProducts({ activeOnly });
    res.json({ success: true, data: products });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Lỗi server" });
  }
}

// GET /api/products/:id
async function handleGetProductById(req, res) {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);
    res.json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Lỗi server" });
  }
}

// POST /api/products
async function handleCreateProduct(req, res) {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Lỗi server" });
  }
}

// PUT /api/products/:id
async function handleUpdateProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const updated = await productService.updateProduct(id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Lỗi server" });
  }
}

// DELETE /api/products/:id
async function handleDeleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    await productService.deleteProduct(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Lỗi server" });
  }
}

module.exports = {
  handleGetProducts,
  handleGetProductById,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
};
