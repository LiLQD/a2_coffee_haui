// backend/src/modules/bulkimport/bulkimport.routes.js

const express = require("express");
const router = express.Router();
const { handleBulkImportProducts } = require("./bulkimport.controller");

// middleware xác thực admin API key
function requireAdminApiKey(req, res, next) {
  const apiKey =
    req.headers["x-admin-apikey"] ||
    req.headers["x-api-key"] ||
    req.body?.adminApiKey;

  const expected = process.env.ADMIN_API_KEY || "a2coffee-admin-secret";

  if (!apiKey || apiKey !== expected) {
    return res.status(403).json({
      error: "Không có quyền bulk import (API key không hợp lệ).",
    });
  }

  next();
}

router.post("/products", requireAdminApiKey, handleBulkImportProducts);

module.exports = router;
