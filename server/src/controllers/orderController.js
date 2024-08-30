// controllers/orderController.js
const Order = require("../models/Order");

// Lấy tất cả các đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name email");
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Lấy thông tin chi tiết của đơn hàng theo ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "id name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: error.message });
  }
};

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Gửi thông báo cho admin
  req.io.emit("newOrder", createdOrder);

  res.status(201).json(createdOrder);
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = req.body.isDelivered;
    order.deliveredAt = req.body.isDelivered ? Date.now() : null;

    const updatedOrder = await order.save();

    // Gửi thông báo cho admin
    req.io.emit("orderStatusChanged", updatedOrder);

    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

const deleteOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (order) {
      res.json({ message: "Order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrderStatus,
};
