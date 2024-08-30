// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

const { getRevenueStats } = require("../controllers/adminController");
router.get("/revenue", protect, admin, getRevenueStats);

module.exports = router;
