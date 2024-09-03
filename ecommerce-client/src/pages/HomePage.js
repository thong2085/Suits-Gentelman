import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";

import { categories, featuredProducts } from "../data/sampleData";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Banner />

      <div className="container mx-auto px-4 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t("featuredCategories")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t("featuredProducts")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products" className="btn">
              {t("viewAllProducts")}
            </Link>
          </div>
        </section>

        <section className="bg-white p-12 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {t("aboutUs")}
          </h2>
          <p className="text-xl mb-8 text-center max-w-3xl mx-auto">
            {t("aboutUsDescription")}
          </p>
          <div className="text-center">
            <Link to="/about" className="btn">
              {t("learnMore")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
