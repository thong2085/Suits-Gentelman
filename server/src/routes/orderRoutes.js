const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrderStatus,
  getMyOrders,
  updateOrderToPaid,
  cancelOrder,
} = require("../controllers/orderController");

// Lấy tất cả đơn hàng (Chỉ dành cho Admin)
router.get("/", protect, admin, getAllOrders);

// Tạo đơn hàng mới
router.post("/", protect, createOrder);

// Lấy chi tiết đơn hàng theo ID
router.get("/:id", protect, getOrderById);

// Cập nhật trạng thái đơn hàng
router.put("/:id", protect, admin, updateOrderStatus);

// Xóa đơn hàng (chỉ dành cho Admin)
router.delete("/:id", protect, admin, deleteOrderStatus);

// Thêm route này
router.get("/myorders", protect, getMyOrders);

// Thanh toán đơn hàng
router.put("/:id/pay", protect, updateOrderToPaid);

// Hủy đơn hàng
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
