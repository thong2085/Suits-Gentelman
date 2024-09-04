// controllers/userController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const Product = require("../models/Product");
const {
  validateEmail,
  validatePassword,
  validateName,
} = require("../utils/validation");

// Tạo token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Đăng ký user mới
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!validateName(name)) {
    return res.status(400).json({ message: "invalidName" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "invalidEmail" });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ message: "passwordTooShort" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "userAlreadyExists" });
  }

  const user = await User.create({
    name,
    email,
    password: await bcryptjs.hash(password, 10),
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "invalidUserData" });
  }
};

// Đăng nhập user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "invalidEmail" });
  }

  const user = await User.findOne({ email });

  if (user && (await bcryptjs.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401).json({ message: "invalidEmailOrPassword" });
  }
};

// Lấy thông tin user hiện tại
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      wishlist: user.wishlist,
      viewedProducts: user.viewedProducts,
      purchasedProducts: user.purchasedProducts,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Cập nhật thông tin user
const updateUser = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    if (req.body.password) {
      user.password = await bcryptjs.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Xóa user (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (user) {
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// Lấy chi tiết user (Admin)
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Trong hàm enable2FA, thay vì tạo QR code, gửi mã OTP qua email
const enable2FA = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Tạo mã OTP
  const otp = speakeasy.totp({
    secret: user.twoFactorSecret,
    encoding: "base32",
  });

  // Gửi mã OTP qua email
  await sendOTPEmail(user, otp);

  res.json({ message: "OTP sent to your email" });
};

// Xác thực 2FA
const verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user._id);

  if (!user || !user.twoFactorSecret) {
    return res.status(400).json({ message: "2FA is not enabled" });
  }

  // Xác thực mã OTP
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if (verified) {
    res.json({ message: "2FA verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid 2FA code" });
  }
};

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Gửi mã OTP qua email
const sendOTPEmail = async (user, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Your OTP code",
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Thêm sản phẩm vào wishlist
const addToWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const product = await Product.findById(req.body.productId);

  if (user && product) {
    if (user.wishlist.includes(product._id)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(product._id);
    await user.save();

    res.status(201).json({ message: "Product added to wishlist" });
  } else {
    res.status(404).json({ message: "User or Product not found" });
  }
};

// Xóa sản phẩm khỏi wishlist
const removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== req.params.id
    );
    await user.save();

    res.json({ message: "Product removed from wishlist" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Lấy danh sách sản phẩm trong wishlist
const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "wishlist",
    "name price image"
  );

  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Lưu sản phẩm đã xem
const addToViewedProducts = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.viewedProducts.includes(req.body.productId)) {
      user.viewedProducts.push(req.body.productId);
      await user.save();
    }
    res.status(201).json({ message: "Product added to viewed history" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Lưu sản phẩm đã mua
const addToPurchasedProducts = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.purchasedProducts.includes(req.body.productId)) {
      user.purchasedProducts.push(req.body.productId);
      await user.save();
    }
    res.status(201).json({ message: "Product added to purchase history" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Lấy chi tiết order
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  addToViewedProducts,
  addToPurchasedProducts,
  enable2FA,
  verify2FA,
};
