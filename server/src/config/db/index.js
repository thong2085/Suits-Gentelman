const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function connect() {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("Kết nối thành công!!");
  } catch (error) {
    console.log("Kết nối thất bại!!");
  }
}

module.exports = { connect };
