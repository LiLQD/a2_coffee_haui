// backend/src/modules/invoice/invoice.routes.js

const express = require("express");
const router = express.Router();
const db = require("../../config/db");

/**
 * GET /api/invoices
 * Lấy danh sách hóa đơn với thống kê
 */
router.get("/", async (req, res) => {
  try {
    const { status, startDate, endDate, limit = 100 } = req.query;

    let query = `
      SELECT 
        o.id,
        o.customer_name,
        o.customer_phone,
        o.total_amount,
        o.status,
        o.payment_method,
        o.payment_status,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      query += " AND o.status = ?";
      params.push(status);
    }

    if (startDate) {
      query += " AND DATE(o.created_at) >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND DATE(o.created_at) <= ?";
      params.push(endDate);
    }

    query += `
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `;
    params.push(parseInt(limit));

    const [invoices] = await db.query(query, params);

    // Thống kê tổng quan
    const [statsResult] = await db.query(`
      SELECT 
        COUNT(*) as total_invoices,
        SUM(total_amount) as total_revenue,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_count
      FROM orders
      WHERE 1=1
      ${startDate ? "AND DATE(created_at) >= ?" : ""}
      ${endDate ? "AND DATE(created_at) <= ?" : ""}
    `, [startDate, endDate].filter(Boolean));

    res.json({
      success: true,
      data: {
        invoices,
        stats: statsResult[0],
      },
    });
  } catch (err) {
    console.error("Get invoices error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/invoices/:id
 * Chi tiết hóa đơn
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.query(
      `SELECT * FROM orders WHERE id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy hóa đơn" });
    }

    const [items] = await db.query(
      `
      SELECT 
        oi.*,
        p.name as product_name,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      data: {
        order: orders[0],
        items,
      },
    });
  } catch (err) {
    console.error("Get invoice detail error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/invoices/:id/status
 * Cập nhật trạng thái hóa đơn
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Trạng thái không hợp lệ. Chỉ chấp nhận: " + validStatuses.join(", "),
      });
    }

    await db.query(
      "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (err) {
    console.error("Update invoice status error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/invoices/:id
 * Xóa hóa đơn (chỉ admin)
 */
router.delete("/:id", async (req, res) => {
  const conn = await db.getConnection();
  
  try {
    await conn.beginTransaction();

    const { id } = req.params;

    // Xóa order_items trước (foreign key)
    await conn.query("DELETE FROM order_items WHERE order_id = ?", [id]);
    
    // Xóa order
    await conn.query("DELETE FROM orders WHERE id = ?", [id]);

    await conn.commit();

    res.json({
      success: true,
      message: "Xóa hóa đơn thành công",
    });
  } catch (err) {
    await conn.rollback();
    console.error("Delete invoice error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

/**
 * GET /api/invoices/stats/daily
 * Thống kê doanh thu theo ngày
 */
router.get("/stats/daily", async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const [results] = await db.query(
      `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as revenue
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      `,
      [parseInt(days)]
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    console.error("Get daily stats error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;