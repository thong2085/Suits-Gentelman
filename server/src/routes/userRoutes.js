// routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  addToViewedProducts,
  addToPurchasedProducts,
  enable2FA,
  verify2FA,
  getUserById,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, admin, getAllUsers); // Chỉ admin mới có thể xem danh sách user
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, admin, deleteUser);
router.post("/wishlist", protect, addToWishlist); // Thêm sản phẩm vào wishlist
router.delete("/wishlist/:id", protect, removeFromWishlist); // Xóa sản phẩm khỏi wishlist
router.get("/wishlist", protect, getWishlist); // Lấy danh sách sản phẩm trong wishlist
router.post("/viewed", protect, addToViewedProducts); // Lưu sản phẩm đã xem
router.post("/purchased", protect, addToPurchasedProducts); // Lưu sản phẩm đã mua

router.post("/enable-2fa", protect, enable2FA);
router.post("/verify-2fa", protect, verify2FA);

module.exports = router;
