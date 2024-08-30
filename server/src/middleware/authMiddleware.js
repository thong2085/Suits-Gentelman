const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// protection middleware
const protect = asyncHandler(async (req, res, next) => {
  let token;
  // check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // set token from Bearer token in header
    try {
      token = req.headers.authorization.split(" ")[1];
      // verify token and get user id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // get user id from decoded token
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Invalid authorized, token failed" });
    }
  }
  // if token doesn't exist in headers send error
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
