// src/modules/order/order.service.js
const orderDao = require("./order.dao");

/**
 * Validate payload từ frontend và gọi DAO để tạo đơn hàng
 */
async function createOrder(payload) {
  if (!payload) {
    throw new Error("Payload rỗng");
  }

  const { customer, items, totalAmount, userId } = payload;

  if (!customer) {
    throw new Error("Thiếu thông tin khách hàng");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Giỏ hàng trống");
  }

  const { name, phone, address, payment_method, email } = customer;

  if (!name || !phone || !address) {
    throw new Error("Họ tên, SĐT và địa chỉ là bắt buộc");
  }

  const total = Number(totalAmount || 0);
  if (!total || Number.isNaN(total)) {
    throw new Error("Tổng tiền không hợp lệ");
  }

  const orderData = {
    userId: userId || null,
    customerName: name,
    customerPhone: phone,
    customerAddress: address,
    totalAmount: total,
    paymentMethod: payment_method || "MOCK",
    customerEmail: email || null,
  };

  const normalizedItems = items.map((i) => ({
    productId: i.productId,
    quantity: Number(i.quantity || 1),
    unitPrice: Number(i.unitPrice || 0),
  }));

  const orderId = await orderDao.createOrder(orderData, normalizedItems);
  const full = await orderDao.findById(orderId);

  return full;
}

async function getOrderById(orderId) {
  const data = await orderDao.findById(orderId);
  if (!data) {
    const err = new Error("Không tìm thấy đơn hàng");
    err.statusCode = 404;
    throw err;
  }
  return data;
}

async function listOrders(query) {
  const { userId, status } = query || {};
  const rows = await orderDao.findAll({
    userId: userId ? Number(userId) : undefined,
    status,
  });
  return rows;
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
};
