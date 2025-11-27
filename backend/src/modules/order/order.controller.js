// src/modules/order/order.controller.js
const orderService = require("./order.service");

async function handleCreateOrder(req, res) {
  try {
    const result = await orderService.createOrder(req.body);
    res.status(201).json({ data: result });
  } catch (err) {
    console.error("createOrder error:", err);
    res
      .status(err.statusCode || 400)
      .json({ error: err.message || "Không tạo được đơn hàng" });
  }
}

async function handleGetOrder(req, res) {
  try {
    const orderId = Number(req.params.id);
    const result = await orderService.getOrderById(orderId);
    res.json({ data: result });
  } catch (err) {
    console.error("getOrder error:", err);
    res
      .status(err.statusCode || 400)
      .json({ error: err.message || "Không lấy được đơn hàng" });
  }
}

async function handleListOrders(req, res) {
  try {
    const result = await orderService.listOrders(req.query);
    res.json({ data: result });
  } catch (err) {
    console.error("listOrders error:", err);
    res
      .status(err.statusCode || 400)
      .json({ error: err.message || "Không lấy được danh sách đơn hàng" });
  }
}

module.exports = {
  handleCreateOrder,
  handleGetOrder,
  handleListOrders,
};
