import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/category/${encodeURIComponent(category.name)}`}
      className="block"
    >
      <div className="card overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 text-center">
          <h3 className="text-xl font-semibold">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
