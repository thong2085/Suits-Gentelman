// pages/ProductPage.js
import React, { useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

const ProductPage = ({ match }) => {
  const [product, setProduct] = React.useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${match.params.id}`);
      setProduct(data);
    };

    fetchProduct();
  }, [match.params.id]);

  return (
    <div>
      <Helmet>
        <title>{product.name} - MyShop</title>
        <meta name="description" content={product.description} />
      </Helmet>
      {/* Nội dung trang sản phẩm */}
    </div>
  );
};

export default ProductPage;
