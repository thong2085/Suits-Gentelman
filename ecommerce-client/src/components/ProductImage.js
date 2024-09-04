import React from "react";
import { getImageUrl } from "../utils/imageUtils";

const ProductImage = ({ src, alt, className }) => {
  return (
    <img
      src={getImageUrl(src)}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/path/to/fallback/image.jpg";
      }}
    />
  );
};

export default ProductImage;
