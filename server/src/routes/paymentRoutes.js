const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

const {
  createPayment,
  capturePayment,
} = require("../controllers/paymentController");

// Tạo thanh toán
router.post("/create-payment", protect, createPayment);

// Xác nhận thanh toán
router.get("/capture", protect, capturePayment);

module.exports = router;
