import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import { fetchCategories } from "../features/categories/categorySlice";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { useTranslation } from "react-i18next";

const ProductListPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { products, loading, error } = useSelector((state) => state.products);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);

  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ keyword, category: selectedCategory }));
  }, [dispatch, keyword, selectedCategory]);

  useEffect(() => {}, [selectedCategory, products]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  useEffect(() => {}, [filteredProducts]);

  if (loading || categoriesLoading) return <div>{t("loading")}</div>;
  if (error || categoriesError)
    return (
      <div>
        {t("error")}: {error || categoriesError}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 ">{t("products")}</h1>
      <div className="flex">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        <div className="flex-1">
          {products.length === 0 ? (
            <p>{t("noProductsFound")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
