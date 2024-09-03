import React from "react";
import { useTranslation } from "react-i18next";

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  const { t } = useTranslation();

  return (
    <aside className="w-64 mr-8 ">
      <h2 className="text-xl font-semibold mb-4">{t("categories")}</h2>
      <ul>
        <li
          className={`cursor-pointer py-2 ${
            !selectedCategory ? "font-bold" : ""
          }`}
          onClick={() => onSelectCategory(null)}
        >
          {t("allCategories")}
        </li>
        {categories.map((category) => (
          <li
            key={category}
            className={`cursor-pointer py-2 ${
              selectedCategory === category ? "font-bold" : ""
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategoryFilter;
