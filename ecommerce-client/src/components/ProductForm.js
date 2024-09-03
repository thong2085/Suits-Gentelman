import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createProduct,
  updateProduct,
} from "../features/products/productSlice";
import ImageUploader from "./ImageUploader";
import { useTranslation } from "react-i18next";

const ProductForm = ({ product, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    countInStock: "",
    image: "",
    brand: "",
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (imageUrl) => {
    setFormData({ ...formData, image: imageUrl });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: Number(formData.price),
      countInStock: Number(formData.countInStock),
    };
    if (product) {
      dispatch(updateProduct({ id: product._id, productData }));
    } else {
      dispatch(createProduct(productData));
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <div className="w-1/3 pr-4">
        <h2 className="text-xl font-bold mb-4">
          {product ? t("editProduct") : t("createProduct")}
        </h2>
        <div className="mb-4">
          <label className="block mb-2">{t("image")}</label>
          <ImageUploader onImageUpload={handleImageUpload} />
          {formData.image && (
            <img
              src={formData.image}
              alt="Product"
              className="mt-2 h-32 object-cover"
            />
          )}
        </div>
      </div>
      <div className="w-2/3 grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Count In Stock</label>
          <input
            type="number"
            name="countInStock"
            value={formData.countInStock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="col-span-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-200 rounded"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {t("save")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
