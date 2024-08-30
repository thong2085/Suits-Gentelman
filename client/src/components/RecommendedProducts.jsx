// components/RecommendedProducts.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const RecommendedProducts = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      const { data } = await axios.get("/api/products/recommendations", config);
      setRecommendedProducts(data);
    };

    fetchRecommendedProducts();
  }, []);

  return (
    <div>
      <h2>Recommended Products</h2>
      <ul>
        {recommendedProducts.map((product) => (
          <li key={product._id}>
            <img src={product.image} alt={product.name} width="50" />
            <p>{product.name}</p>
            <p>{product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedProducts;
