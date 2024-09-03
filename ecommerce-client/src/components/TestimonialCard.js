import React from "react";
import { Link } from "react-router-dom";

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
      <div className="flex items-center justify-between">
        <p className="font-semibold">{testimonial.author}</p>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={
                i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
              }
            >
              ★
            </span>
          ))}
        </div>
      </div>
      {testimonial.productId && (
        <Link
          to={`/product/${testimonial.productId}`}
          className="text-blue-500 hover:underline mt-2 block"
        >
          Xem sản phẩm
        </Link>
      )}
    </div>
  );
};

export default TestimonialCard;
