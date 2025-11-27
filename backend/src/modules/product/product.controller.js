// src/modules/product/product.controller.js
const productService = require("./product.service");

<<<<<<< HEAD
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
=======
async function handleGetProducts(req, res, next) {
  try {
    const activeOnly = req.query.activeOnly === "true";
    const products = await productService.getProducts(activeOnly);
    res.json(products);
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
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function handleCreateProduct(req, res, next) {
  try {
    const created = await productService.createProduct(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function handleUpdateProduct(req, res, next) {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    res.json(updated);
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
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
  }
}

module.exports = {
  handleGetProducts,
  handleGetProductById,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
<<<<<<< HEAD
=======
  handleBulkImport,
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
};
