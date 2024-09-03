const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/top", productController.getTopReviews);

module.exports = router;
