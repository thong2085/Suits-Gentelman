import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";

const CategoryPage = () => {
  const { t } = useTranslation();
  const { category } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }, [products, category]);

  if (loading) return <div>{t("loading")}</div>;
  if (error)
    return (
      <div>
        {t("error")}: {error}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t(category)}</h1>
      {filteredProducts.length === 0 ? (
        <p>{t("noProductsInCategory")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
