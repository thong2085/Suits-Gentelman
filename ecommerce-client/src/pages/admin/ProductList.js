import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  fetchProductList,
} from "../../features/products/productSlice";
import Modal from "../../components/Modal";
import ProductForm from "../../components/ProductForm";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatCurrency";

const ProductList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProductList());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm(t("confirmDelete"))) {
      dispatch(deleteProduct(id));
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  if (loading) return <div>{t("loading")}</div>;
  if (error)
    return (
      <div>
        {t("error")}: {error}
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t("productList")}</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {t("createProduct")}
        </button>
      </div>
      <div className="table-container">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">{t("id")}</th>
              <th className="py-2 px-4 border-b">{t("name")}</th>
              <th className="py-2 px-4 border-b">{t("image")}</th>
              <th className="py-2 px-4 border-b">{t("price")}</th>
              <th className="py-2 px-4 border-b">{t("category")}</th>
              <th className="py-2 px-4 border-b">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="py-2 px-4 border-b">{product._id}</td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">
                    <img
                      src={
                        Array.isArray(product.images)
                          ? product.images[0]
                          : product.images
                      }
                      alt={product.name}
                      className="w-10 h-10 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-2 px-4 border-b">{product.category}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:underline"
                    >
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ProductForm product={editingProduct} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default ProductList;
