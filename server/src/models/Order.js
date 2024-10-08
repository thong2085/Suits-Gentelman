// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    userInfo: {
      name: String,
      email: String,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true }, // Thay đổi từ 'qty' thành 'quantity'
        images: { type: Array, required: true }, // Đảm bảo trường này tồn tại
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["PayPal", "COD"], // Add COD as a payment method
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    orderCode: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
orderSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("user")) {
    const user = await mongoose.model("User").findById(this.user);
    if (user) {
      this.userInfo = {
        name: user.name,
        email: user.email,
      };
    }
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
