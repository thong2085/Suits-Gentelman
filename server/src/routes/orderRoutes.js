const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrderStatus,
} = require("../controllers/orderController");

// Lấy tất cả đơn hàng (Chỉ dành cho Admin)
router.get("/", protect, admin, getAllOrders);

// Tạo đơn hàng mới
router.post("/create", protect, createOrder);

// Lấy chi tiết đơn hàng theo ID
router.get("/:id", protect, getOrderById);

// Cập nhật trạng thái đơn hàng
router.put("/:id", protect, admin, updateOrderStatus);

// Xóa đơn hàng (chỉ dành cho Admin)
router.delete("/:id", protect, admin, deleteOrderStatus);

module.exports = router;
