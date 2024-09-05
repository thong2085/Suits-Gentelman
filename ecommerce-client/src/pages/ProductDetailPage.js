import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/formatCurrency";
import ProductReviews from "../components/ProductReviews";
import ImageGallery from "react-image-gallery";
import Zoom from "react-medium-image-zoom";
import "react-image-gallery/styles/css/image-gallery.css";
import "react-medium-image-zoom/dist/styles.css";

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState([]);

  const fetchProduct = useCallback(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (product && product.images) {
      const galleryImages = product.images.map((img) => ({
        original: img,
        thumbnail: img,
        renderItem: (item) => (
          <Zoom>
            <img src={item.original} alt={product.name} />
          </Zoom>
        ),
      }));
      setImages(galleryImages);
    }
  }, [product]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  if (loading) return <div>{t("loading")}</div>;
  if (error)
    return (
      <div>
        {t("error")}: {error}
      </div>
    );
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 w-full md:w-1/2">
            <ImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={false}
              useBrowserFullscreen={false}
            />
          </div>
          <div className="p-8 w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
            <p className="text-red-500 font-bold text-2xl mb-4">
              {formatCurrency(product.price)}
            </p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-2 font-medium">
                {t("quantity")}:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border rounded px-2 py-1 w-16"
              />
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              {t("addToCart")}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <ProductReviews productId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
