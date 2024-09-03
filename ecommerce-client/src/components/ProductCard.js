import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="card overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover object-center"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2">{product.category}</p>
          <p className="text-accent font-bold">
            {formatCurrency(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
