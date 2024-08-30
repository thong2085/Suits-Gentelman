import React, { memo } from "react";

// Component được tối ưu hóa
const ProductItem = memo(({ product }) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
});
export default ProductItem;
