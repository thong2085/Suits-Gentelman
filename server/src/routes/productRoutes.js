// routes/productRoutes.js
const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllProducts,
  addProductReview,
  getProductReviews,
  getRecommendedProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const router = express.Router();

router.get("/", getAllProducts);
router.post("/create", protect, admin, createProduct);
router.get("/:id", protect, getProductById);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

router.post("/:id/reviews", protect, addProductReview); // Thêm đánh giá
router.get("/:id/reviews", getProductReviews); // Lấy danh sách đánh giá
router.get("/recommendations", protect, getRecommendedProducts); // Lấy gợi ý sản phẩm
module.exports = router;
