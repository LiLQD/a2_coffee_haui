// src/modules/order/order.service.js
const orderDao = require("./order.dao");

/**
 * Biz logic tạo đơn hàng
 */
async function createOrder(payload) {
  if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error("Đơn hàng phải có ít nhất 1 sản phẩm");
  }

  if (!payload.customer || !payload.customer.name || !payload.customer.phone) {
    throw new Error("Thiếu thông tin khách hàng (tên / số điện thoại)");
  }

  // Tính lại totalAmount nếu cần (phòng trường hợp frontend gửi sai)
  const computedTotal = payload.items.reduce((sum, it) => {
    const qty = it.quantity || 1;
    const unitPrice = it.unitPrice || it.unit_price || 0;
    return sum + qty * unitPrice;
  }, 0);

  const totalAmount = payload.totalAmount || computedTotal;

  const data = await orderDao.createOrder({
    userId: payload.userId || null,
    customer: payload.customer,
    items: payload.items,
    totalAmount,
  });

  return data;
}

/**
 * Biz logic lấy chi tiết 1 order
 */
async function getOrderById(orderId) {
  const data = await orderDao.findById(orderId);
  if (!data) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }
  return data;
}

/**
 * Biz logic lấy danh sách order (order history)
 */
async function listOrders(query) {
  const filters = {
    userId: query.userId ? Number(query.userId) : null,
    status: query.status || null,
  };

  const data = await orderDao.findAll(filters);
  return data;
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
};
