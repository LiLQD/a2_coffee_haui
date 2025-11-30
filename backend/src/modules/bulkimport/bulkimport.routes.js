// backend/src/modules/bulkimport/bulkimport.routes.js

const express = require("express");
const router = express.Router();
const { handleBulkImportProducts } = require("./bulkimport.controller");

// KHÓA ADMIN CỐ ĐỊNH – phải khớp với LoginPage + localStorage
const ADMIN_API_KEY = "a2coffee-admin-secret";

// middleware xác thực admin API key
function requireAdminApiKey(req, res, next) {
  // chỉ nhận đúng 1 header cho rõ ràng
  const apiKey = req.headers["x-admin-apikey"];

  // log debug để nếu còn lỗi thì nhìn được giá trị thực tế
  console.log("[BulkImport] header x-admin-apikey =", apiKey);
  console.log("[BulkImport] expected ADMIN_API_KEY =", ADMIN_API_KEY);

  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return res.status(403).json({
      error: "Không có quyền bulk import (API key không hợp lệ).",
    });
  }

  next();
}

// POST /api/bulkimport/products
router.post("/products", requireAdminApiKey, handleBulkImportProducts);

module.exports = router;
