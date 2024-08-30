// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Route để khởi động xác thực Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Route callback sau khi xác thực Google thành công
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard"); // Chuyển hướng sau khi đăng nhập thành công
  }
);

// Route để khởi động xác thực Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);

// Route callback sau khi xác thực Facebook thành công
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard"); // Chuyển hướng sau khi đăng nhập thành công
  }
);

module.exports = router;
