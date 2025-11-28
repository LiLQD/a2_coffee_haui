// src/modules/order/order.controller.js
const orderService = require("./order.service");

/**
 * POST /api/orders
 * Body: { userId, customer, items, totalAmount }
 */
async function handleCreateOrder(req, res, next) {
  try {
    const result = await orderService.createOrder(req.body);
    // 201 Created
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/:id
 */
async function handleGetOrderById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await orderService.getOrderById(id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders?userId=1&status=PENDING
 */
async function handleListOrders(req, res, next) {
  try {
    const result = await orderService.listOrders(req.query);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleCreateOrder,
  handleGetOrderById,
  handleListOrders,
};
