// controllers/adminController.js
const Order = require("../models/Order");

const getRevenueStats = async (req, res) => {
  try {
    // Giả sử bạn tính toán tổng doanh thu mỗi tháng
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { $month: "$paidAt" },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      revenueData.map((item) => ({
        month: item._id,
        revenue: item.revenue,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRevenueStats,
};
