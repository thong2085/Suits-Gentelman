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
} = require("../controllers/productController");
const router = express.Router();

router.route("/").get(getAllProducts).post(protect, admin, createProduct);
router.get("/categories", getAllCategories);
router.get("/category/:category", getProductsByCategory);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.post("/:id/reviews", protect, addProductReview); // Thêm đánh giá
router.get("/:id/reviews", getProductReviews); // Lấy danh sách đánh giá
router.get("/recommendations", protect, getRecommendedProducts); // Lấy gợi ý sản phẩm

router.post("/import", protect, admin, importProducts);

module.exports = router;
