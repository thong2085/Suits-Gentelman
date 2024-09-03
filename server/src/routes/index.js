const paymentRoutes = require("./paymentRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const authRoutes = require("./authRoutes");
const orderRoutes = require("./orderRoutes");
const reviewRoutes = require("./reviewRoutes");

const routes = (app) => {
  app.use("/api/users", userRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/auth", authRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/reviews", reviewRoutes);
};

module.exports = routes;
