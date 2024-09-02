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
  searchProducts,
  getProductsByCategory,
} = require("../controllers/productController");
const router = express.Router();

router.get("/", getAllProducts);
router.post("/create", protect, admin, createProduct);
router.get("/search", searchProducts); // Thêm route tìm kiếm
router.get("/category/:category", getProductsByCategory); // Thêm route lấy sản phẩm theo danh mục
router.get("/:id", getProductById); // Loại bỏ middleware protect
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

router.post("/:id/reviews", protect, addProductReview); // Thêm đánh giá
router.get("/:id/reviews", getProductReviews); // Lấy danh sách đánh giá
router.get("/recommendations", protect, getRecommendedProducts); // Lấy gợi ý sản phẩm

module.exports = router;
