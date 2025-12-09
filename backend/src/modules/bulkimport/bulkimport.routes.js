// backend/src/modules/bulkimport/bulkimport.routes.js

const express = require("express");
const router = express.Router();
const { handleBulkImportProducts, handleResetProductIds } = require("./bulkimport.controller");

const ADMIN_API_KEY = "a2coffee-admin-secret";

// middleware xác thực admin API key
function requireAdminApiKey(req, res, next) {

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


router.post("/products", requireAdminApiKey, handleBulkImportProducts);
router.post("/reset-ids", requireAdminApiKey, handleResetProductIds);
module.exports = router;
