// src/modules/order/order.dao.js
const db = require("../../config/db");

/**
 * Tạo order + order_items trong 1 transaction
 * @param {object} orderData  thông tin đơn hàng (user_id, customer_*, total_amount, ...)
 * @param {Array}  items      [{ productId, quantity, unitPrice }]
 */
async function createOrder(orderData, items) {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const {
      userId,
      customerName,
      customerPhone,
      customerAddress,
      totalAmount,
      paymentMethod,
      customerEmail,
      note,
      timeNote,
    } = orderData;

    const [orderResult] = await conn.query(
      `
      INSERT INTO orders (
        user_id,
        customer_name,
        customer_phone,
        customer_address,
        total_amount,
        status,
        payment_method,
        payment_status,
        payment_ref
      )
      VALUES (?, ?, ?, ?, ?, 'PENDING', ?, 'UNPAID', NULL)
    `,
      [
        userId || null,
        customerName,
        customerPhone,
        customerAddress,
        totalAmount,
        paymentMethod || "MOCK",
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order_items
    for (const item of items) {
      const qty = Number(item.quantity || 1);
      const price = Number(item.unitPrice || 0);
      const subtotal = qty * price;

      await conn.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          unit_price,
          subtotal
        )
        VALUES (?, ?, ?, ?, ?)
      `,
        [orderId, item.productId, qty, price, subtotal]
      );
    }

    await conn.commit();
    return orderId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/**
 * Lấy 1 order + items theo id
 */
async function findById(orderId) {
  const [rowsOrder] = await db.query(
    `
    SELECT *
    FROM orders
    WHERE id = ?
  `,
    [orderId]
  );

  if (rowsOrder.length === 0) return null;
  const order = rowsOrder[0];

  const [rowsItems] = await db.query(
    `
    SELECT 
      oi.id,
      oi.product_id,
      oi.quantity,
      oi.unit_price,
      oi.subtotal,
      p.name,
      p.description,
      p.image_url
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `,
    [orderId]
  );

  return { order, items: rowsItems };
}

/**
 * Liệt kê order, có thể lọc theo userId / status
 */
async function findAll({ userId, status } = {}) {
  const conditions = [];
  const params = [];

  if (userId) {
    conditions.push("user_id = ?");
    params.push(userId);
  }
  if (status) {
    conditions.push("status = ?");
    params.push(status);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows] = await db.query(
    `
    SELECT *
    FROM orders
    ${where}
    ORDER BY created_at DESC
  `,
    params
  );

  return rows;
}

module.exports = {
  createOrder,
  findById,
  findAll,
};
