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
  getAllCategories,
  importProducts,
  getFeaturedProducts,
  getProducts,
} = require("../controllers/productController");
const router = express.Router();

// Đặt các route cụ thể trước các route có tham số
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/admin", protect, admin, getAllProducts);
router.get("/categories", getAllCategories);
router.get("/category/:category", getProductsByCategory);
router.get("/featured", getFeaturedProducts); // Đặt route này trước /:id
router.get("/recommendations", protect, getRecommendedProducts);
router.post("/import", protect, admin, importProducts);

// Đặt route có tham số ở cuối
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.post("/:id/reviews", protect, addProductReview); // Thêm đánh giá
router.get("/:id/reviews", getProductReviews); // Lấy danh sách đánh giá

module.exports = router;
