// src/modules/order/order.dao.js
const db = require("../../config/db");

/**
 * Helper: map rows (order + items join) thành { order, items }
 */
function mapOrderWithItems(rows) {
  if (!rows || rows.length === 0) return null;

  const first = rows[0];

  const order = {
    id: first.order_id,
    user_id: first.user_id,
    customer_name: first.customer_name,
    customer_phone: first.customer_phone,
    customer_address: first.customer_address,
    total_amount: first.total_amount,
    status: first.status,
    payment_method: first.payment_method,
    payment_status: first.payment_status,
    payment_ref: first.payment_ref,
    created_at: first.created_at,
    updated_at: first.updated_at,
  };

  const items = rows
    .filter((r) => r.item_id != null)
    .map((r) => ({
      id: r.item_id,
      product_id: r.product_id,
      quantity: r.quantity,
      unit_price: r.unit_price,
      subtotal: r.subtotal,
      name: r.product_name,
      description: r.product_description,
      image_url: r.image_url,
    }));

  return { order, items };
}

/**
 * Tạo đơn hàng + order_items trong transaction
 * payload: { userId, customer, items, totalAmount }
 */
async function createOrder(payload) {
  const { userId, customer, items, totalAmount } = payload;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      `
      INSERT INTO orders 
        (user_id, customer_name, customer_phone, customer_address,
         total_amount, status, payment_method, payment_status, payment_ref)
      VALUES (?, ?, ?, ?, ?, 'PENDING', ?, 'UNPAID', NULL)
    `,
      [
        userId || null,
        customer.name,
        customer.phone,
        customer.address,
        totalAmount,
        customer.payment_method || "CASH_ON_DELIVERY",
      ]
    );

    const orderId = orderResult.insertId;

    if (Array.isArray(items)) {
      for (const it of items) {
        const qty = it.quantity || 1;
        const unitPrice = it.unitPrice || it.unit_price || 0;
        const subtotal = qty * unitPrice;

        await conn.query(
          `
          INSERT INTO order_items
            (order_id, product_id, quantity, unit_price, subtotal)
          VALUES (?, ?, ?, ?, ?)
        `,
          [orderId, it.productId, qty, unitPrice, subtotal]
        );
      }
    }

    await conn.commit();

    // Lấy lại order + items vừa tạo, join với products
    const [rows] = await conn.query(
      `
      SELECT
        o.id AS order_id,
        o.user_id,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.total_amount,
        o.status,
        o.payment_method,
        o.payment_status,
        o.payment_ref,
        o.created_at,
        o.updated_at,
        oi.id AS item_id,
        oi.product_id,
        oi.quantity,
        oi.unit_price,
        oi.subtotal,
        p.name AS product_name,
        p.description AS product_description,
        p.image_url
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE o.id = ?
    `,
      [orderId]
    );

    return mapOrderWithItems(rows);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/**
 * Lấy chi tiết 1 order theo id
 */
async function findById(orderId) {
  const [rows] = await db.query(
    `
    SELECT
      o.id AS order_id,
      o.user_id,
      o.customer_name,
      o.customer_phone,
      o.customer_address,
      o.total_amount,
      o.status,
      o.payment_method,
      o.payment_status,
      o.payment_ref,
      o.created_at,
      o.updated_at,
      oi.id AS item_id,
      oi.product_id,
      oi.quantity,
      oi.unit_price,
      oi.subtotal,
      p.name AS product_name,
      p.description AS product_description,
      p.image_url
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE o.id = ?
  `,
    [orderId]
  );

  return mapOrderWithItems(rows);
}

/**
 * Lấy danh sách đơn hàng (dùng cho Order History)
 * filters: { userId, status }
 */
async function findAll(filters = {}) {
  const { userId, status } = filters;

  const sql = `
    SELECT
      o.id,
      o.user_id,
      o.customer_name,
      o.customer_phone,
      o.customer_address,
      o.total_amount,
      o.status,
      o.payment_method,
      o.payment_status,
      o.created_at,
      COUNT(oi.id) AS item_count
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE ( ? IS NULL OR o.user_id = ? )
      AND ( ? IS NULL OR o.status = ? )
    GROUP BY
      o.id, o.user_id, o.customer_name, o.customer_phone,
      o.customer_address, o.total_amount, o.status,
      o.payment_method, o.payment_status, o.created_at
    ORDER BY o.created_at DESC
  `;

  const params = [
    userId || null,
    userId || null,
    status || null,
    status || null,
  ];

  const [rows] = await db.query(sql, params);
  return rows;
}

module.exports = {
  createOrder,
  findById,
  findAll,
};
