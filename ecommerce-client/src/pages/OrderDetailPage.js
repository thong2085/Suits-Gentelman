import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderById, cancelOrder } from "../features/orders/orderSlice";
import PayPalButton from "../components/PayPalButton";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/formatCurrency";

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const { orderCode } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.orders);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [justCancelled, setJustCancelled] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderById(orderCode));
  }, [dispatch, orderCode]);

  const handleCancelOrder = async () => {
    if (window.confirm(t("confirmCancelOrder"))) {
      setCancelLoading(true);
      setCancelError(null);
      try {
        await dispatch(cancelOrder(orderCode)).unwrap();
        dispatch(fetchOrderById(orderCode));
        setJustCancelled(true);
        setTimeout(() => setJustCancelled(false), 3000);
      } catch (err) {
        setCancelError(err.message || t("failedToCancelOrder"));
      } finally {
        setCancelLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "text-yellow-500";
      case "shipped":
        return "text-blue-500";
      case "delivered":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) return <div>{t("loading")}</div>;
  if (error)
    return (
      <div>
        {t("error")}: {error}
      </div>
    );
  if (!order) return <div>{t("orderNotFound")}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{t("orderDetails")}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">{t("orderSummary")}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <span className="font-semibold">{t("orderId")}:</span>{" "}
              {order.orderCode}
            </p>
            <p>
              <span className="font-semibold">{t("orderDate")}:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">{t("totalPrice")}:</span>{" "}
              {formatCurrency(order.totalPrice)}
            </p>
            <p>
              <span className="font-semibold">{t("paymentStatus")}:</span>{" "}
              {order.isPaid ? t("paid") : t("notPaid")}
            </p>
            <p>
              <span className="font-semibold">{t("orderStatus")}:</span>{" "}
              <span
                className={`${getStatusColor(order.status)} ${
                  justCancelled ? "animate-pulse font-bold" : ""
                }`}
              >
                {t(order.status)}
              </span>
              {justCancelled && (
                <span className="ml-2 text-red-500 animate-bounce">
                  &#x2757; {t("orderJustCancelled")}
                </span>
              )}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {t("shippingAddress")}
            </h3>
            <p>{order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}{" "}
              {order.shippingAddress?.country}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{t("orderItems")}</h3>
          <ul>
            {order.orderItems?.map((item) => (
              <li key={item._id} className="flex items-center mb-2">
                <img
                  src={
                    Array.isArray(item.images) ? item.images[0] : item.images
                  }
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded mr-4"
                />
                <div className="flex-grow">
                  <span className="block">{item.name}</span>
                  <span className="block">
                    {t("quantity")}: {item.quantity}
                  </span>
                  <span className="block">
                    {t("price")}: {formatCurrency(item.price)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">{t("orderSummary")}</h2>
            <p>
              {t("itemsPrice")}: {formatCurrency(order.itemsPrice)}
            </p>
            <p>
              {t("shippingPrice")}: {formatCurrency(order.shippingPrice)}
            </p>
            <p>
              {t("taxPrice")}: {formatCurrency(order.taxPrice)}
            </p>
            <p className="text-xl font-bold mt-4">
              {t("total")}: {formatCurrency(order.totalPrice)}
            </p>
          </div>
        </div>
      </div>
      {!order.isPaid && order.status !== "cancelled" && (
        <PayPalButton orderId={order._id} amount={order.totalPrice} />
      )}
      {order.status === "processing" && (
        <button
          onClick={handleCancelOrder}
          disabled={cancelLoading || order.status === "cancelled"}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
        >
          {cancelLoading ? t("cancelling") : t("cancelOrder")}
        </button>
      )}
      {order.status === "cancelled" && (
        <p className="mt-4 text-red-500 font-semibold">{t("orderCancelled")}</p>
      )}
      {cancelError && <p className="mt-2 text-red-500">{cancelError}</p>}
    </div>
  );
};

export default OrderDetailPage;
