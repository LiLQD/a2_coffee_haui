const express = require("express");
const requireAdmin = require("../../middleware/requireAdmin");

const router = express.Router();

// ví dụ: import sản phẩm (bạn tự viết logic sau)
router.post("/products", requireAdmin, async (req, res) => {
  return res.json({
    message: "Import thành công (demo)",
    admin: req.adminUser,
  });
});

module.exports = router;
