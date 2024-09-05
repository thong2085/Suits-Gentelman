const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

const restoreImageField = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const products = await Product.find({ images: { $exists: true, $ne: [] } });

    for (const product of products) {
      if (product.images && product.images.length > 0) {
        product.image = product.images[0];
        await Product.updateOne(
          { _id: product._id },
          { $set: { image: product.image } }
        );
        console.log(`Restored image for product: ${product._id}`);
      }
    }

    console.log("Restoration completed");
  } catch (error) {
    console.error("Restoration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

restoreImageField();
