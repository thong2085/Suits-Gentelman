const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// @desc Authenticated user & get token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = { generateToken };
