import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../features/products/productSlice";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return null;

  const handleAddToCart = () => {
    // Implement add to cart functionality
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4 mb-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto"
          />
        </div>
        <div className="w-full md:w-1/2 px-4">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl mb-4">${product.price.toFixed(2)}</p>
          <p className="mb-4">{product.description}</p>
          <div className="flex items-center mb-4">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border rounded px-2 py-1 w-16 mr-4"
            />
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;