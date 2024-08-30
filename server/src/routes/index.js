const paymentRoutes = require("./paymentRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const authRoutes = require("./authRoutes");
const orderRoutes = require("./orderRoutes");

const routes = (app) => {
  app.use("/api/users", userRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/auth", authRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/product", productRoutes);
};

module.exports = routes;
