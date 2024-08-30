// controllers/productController.js
const Product = require("../models/Product");
const User = require("../models/User");

const getAllProducts = async (req, res) => {
  try {
    // Truy vấn cơ sở dữ liệu
    const products = await Product.find({});

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// Tạo sản phẩm mới (Admin)
const createProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = new Product({
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// Cập nhật sản phẩm (Admin)
const updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// Xóa sản phẩm (Admin)
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    res.json({ message: "Product removed" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// Thêm đánh giá cho sản phẩm
const addProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// Lấy danh sách đánh giá sản phẩm
const getProductReviews = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product.reviews);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// Tính toán gợi ý sản phẩm
const getRecommendedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("viewedProducts")
      .populate("purchasedProducts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const viewedProductIds = user.viewedProducts.map((product) => product._id);
    const purchasedProductIds = user.purchasedProducts.map(
      (product) => product._id
    );

    // Tìm các sản phẩm tương tự dựa trên các sản phẩm đã xem hoặc mua
    const recommendedProducts = await Product.find({
      _id: { $nin: [...viewedProductIds, ...purchasedProductIds] }, // Loại trừ các sản phẩm đã xem hoặc mua
      category: { $in: user.viewedProducts.map((product) => product.category) }, // Sản phẩm cùng danh mục
    }).limit(10); // Giới hạn số lượng gợi ý

    res.json(recommendedProducts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recommended products" });
  }
};
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getProductReviews,
  getRecommendedProducts,
};
