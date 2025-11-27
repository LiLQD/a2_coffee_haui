// src/modules/product/product.controller.js
const productService = require("./product.service");

async function handleGetProducts(req, res, next) {
  try {
    const activeOnly = req.query.activeOnly === "true";
    const products = await productService.getProducts(activeOnly);
    res.json({ data: products });
  } catch (err) {
    next(err);
  }
}

async function handleGetProductById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

async function handleCreateProduct(req, res, next) {
  try {
    const created = await productService.createProduct(req.body);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

async function handleUpdateProduct(req, res, next) {
  try {
    const updated = await productService.updateProduct(
      req.params.id,
      req.body
    );
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

async function handleDeleteProduct(req, res, next) {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function handleBulkImport(req, res, next) {
  try {
    const list = Array.isArray(req.body) ? req.body : [];
    const count = await productService.bulkImport(list);
    res.json({ imported: count });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetProducts,
  handleGetProductById,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleBulkImport,
};
