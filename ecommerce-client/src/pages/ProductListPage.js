import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import { fetchCategories } from "../features/categories/categorySlice";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { useTranslation } from "react-i18next";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";

const ProductListPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);

  const { products, loading, error, totalProducts } = useSelector(
    (state) => state.products
  );
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
    dispatch(
      fetchProducts({
        keyword,
        category: selectedCategory,
        page: currentPage,
        limit: productsPerPage,
      })
    );
  }, [dispatch, keyword, selectedCategory, currentPage, productsPerPage]);

  useEffect(() => {}, [selectedCategory, products]);
  useEffect(() => {}, [totalProducts, productsPerPage]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    navigate(`/products?keyword=${keyword}&category=${category}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(
      `/products?keyword=${keyword}&category=${selectedCategory}&page=${page}`
    );
  };

  if (loading || categoriesLoading) return <div>{t("loading")}</div>;
  if (error || categoriesError)
    return (
      <div>
        {t("error")}: {error || categoriesError}
      </div>
    );
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("products")}</h1>
      <div className="flex flex-col sm:flex-row">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        <div className="flex-1 mt-6 sm:mt-0">
          {products.length === 0 ? (
            <p>{t("noProductsFound")}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination
                className="mt-8"
                currentPage={currentPage}
                totalPages={Math.ceil(totalProducts / productsPerPage)}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
