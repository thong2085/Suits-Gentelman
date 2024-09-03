import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductsByCategory } from "../features/products/productSlice";
import ProductCard from "../components/ProductCard";
const CategoryPage = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  useEffect(() => {
    console.log("Fetching products for category:", formattedCategory);
    dispatch(fetchProductsByCategory(formattedCategory));
  }, [dispatch, formattedCategory]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  console.log("Rendered products:", products);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{formattedCategory}</h1>
      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
export default CategoryPage;
