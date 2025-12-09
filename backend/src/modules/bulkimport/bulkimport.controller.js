// backend/src/modules/bulkimport/bulkimport.controller.js

const bulkImportService = require("./bulkimport.service");
const productService = require("../product/product.service");

async function handleBulkImportProducts(req, res) {
  try {
    const items = req.body?.products;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "File CSV không có dữ liệu hợp lệ.",
      });
    }

    const result = await bulkImportService.importProducts(items);

    // Lấy lại danh sách sau khi import
    const products = await productService.getProducts();

    return res.json({
      success: true,
      message: `Import hoàn tất! Thêm mới: ${result.insertedCount}, Cập nhật: ${result.updatedCount}`,
      data: {
        ...result,
        products
      },
    });

  } catch (err) {
    console.error("Bulk import error:", err);
    return res.status(500).json({
      error: "Lỗi khi import dữ liệu: " + err.message,
    });
  }
}

async function handleResetProductIds(req, res) {
  try {
    await bulkImportService.resetProductIds();

    // Lấy lại danh sách
    const products = await productService.getProducts();

    res.json({
      success: true,
      message: "Reset ID thành công",
      data: products,
    });
  } catch (err) {
    console.error("Reset IDs error:", err);
    res.status(500).json({
      error: "Lỗi khi reset IDs: " + err.message,
    });
  }
}

module.exports = {
  handleBulkImportProducts,
  handleResetProductIds,
};