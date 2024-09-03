const asyncHandler = require("express-async-handler");

// controllers/orderController.js
const Order = require("../models/Order");

// Lấy tất cả các đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");

    // Xử lý trường hợp user không tồn tại
    const processedOrders = orders.map((order) => ({
      ...order.toObject(),
      user: order.user || { name: "Deleted User", email: "N/A" },
    }));

    res.json(processedOrders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status;

    if (req.body.status === "shipped" && !order.shippedAt) {
      order.shippedAt = Date.now();
    }

    if (req.body.status === "cancelled" && !order.cancelledAt) {
      order.cancelledAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

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

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(404).json({ message: "Orders not found" });
  }
};

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Kiểm tra xem người dùng có quyền hủy đơn hàng không
  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error("User not authorized to cancel this order");
  }

  if (order.status !== "processing") {
    res.status(400);
    throw new Error("Order cannot be cancelled");
  }

  order.status = "cancelled";
  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrderStatus,
  getMyOrders,
  updateOrderToPaid,
  cancelOrder,
};
