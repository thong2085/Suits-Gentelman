import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";

import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import TestimonialCard from "../components/TestimonialCard";

import { categories, featuredProducts } from "../data/sampleData";
import axiosInstance from "../api/axios";

const HomePage = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/api/reviews/top");
        setTestimonials(response.data);
      } catch (error) {
        console.error("Failed to fetch top reviews", error);
        setError("Failed to load testimonials. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopReviews();
  }, []);

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

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t("customerTestimonials")}
          </h2>
          {isLoading ? (
            <p>Loading testimonials...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                />
              ))}
            </div>
          ) : (
            <p>No testimonials available at the moment.</p>
          )}
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
