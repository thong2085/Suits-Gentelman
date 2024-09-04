// controllers/productController.js
const Product = require("../models/Product");
const User = require("../models/User");
const productsData = require("../data/productsData.json");
const asyncHandler = require("express-async-handler");

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
  try {
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
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add review", error: error.message });
  }
};

// Lấy danh sách đánh giá sản phẩm
const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "name"
    );

    if (product) {
      res.json(product.reviews || []);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reviews", error: error.message });
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

// Tìm kiếm sản phẩm
const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to search products" });
  }
};

// Lấy sản phẩm theo danh mục
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products by category" });
  }
};

// Thêm phương thức để lấy tất cả các danh mục
const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// Thêm phương thức mới để lấy sản phẩm theo danh mục
const getProducts = async (req, res) => {
  try {
    const { keyword, category } = req.query;

    let query = {};
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    const products = await Product.find(query);
    console.log(
      "Products found:",
      products.length,
      products.map((p) => ({ name: p.name, category: p.category }))
    );

    res.json(products);
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTopReviews = async (req, res) => {
  try {
    if (!Product || typeof Product.aggregate !== "function") {
      throw new Error("Product model is not properly defined or imported");
    }

    const topReviews = await Product.aggregate([
      { $unwind: "$reviews" },
      { $match: { "reviews.rating": { $gte: 4 } } },
      { $sort: { "reviews.rating": -1, "reviews.createdAt": -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "reviews.user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          content: "$reviews.comment",
          author: "$userDetails.name",
          rating: "$reviews.rating",
          productId: "$_id",
        },
      },
    ]);

    if (topReviews.length === 0) {
      return res.status(404).json({ message: "No top reviews found" });
    }

    res.json(topReviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching top reviews", error: error.message });
  }
};

const importProducts = asyncHandler(async (req, res) => {
  await Product.deleteMany({});
  const products = await Product.insertMany(productsData);
  res.status(201).json(products);
});

const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.aggregate([
      { $match: { numReviews: { $gt: 0 } } },
      { $sort: { rating: -1, numReviews: -1 } },
      { $limit: 6 },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          image: 1,
          category: 1,
          rating: 1,
          numReviews: 1,
        },
      },
    ]);

    if (featuredProducts.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }

    res.json(featuredProducts);
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    res.status(500).json({
      message: "Failed to fetch featured products",
      error: error.message,
    });
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
  searchProducts,
  getProductsByCategory,
  getAllCategories,
  getProducts,
  importProducts,
  getTopReviews,
  getFeaturedProducts,
};
