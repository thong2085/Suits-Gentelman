import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchOrderById,
  updateOrderStatus,
} from "../features/orders/orderSlice";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/formatCurrency";

const AdminOrderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.orders);
  const [currentStatus, setCurrentStatus] = useState(
    order?.status || "processing"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
    }
  }, [order]);

  useEffect(() => {
    if (order) {
      if (order.status === "Đang xử lý") {
        setCurrentStep(0);
      } else if (order.status === "Đã gửi") {
        setCurrentStep(1);
      } else if (order.status === "Đã giao") {
        setCurrentStep(2);
      } else if (order.status === "Đã hủy") {
        setCurrentStep(3);
      }
    }
  }, [order]);

  const steps = order
    ? [
        {
          status: "processing",
          label: t("orderProcessed"),
          date: order.createdAt,
        },
        { status: "shipped", label: t("orderShipped"), date: order.shippedAt },
        {
          status: "delivered",
          label: t("orderDelivered"),
          date: order.deliveredAt,
        },
        {
          status: "cancelled",
          label: t("orderCancelled"),
          date: order.cancelledAt,
        },
      ]
    : [];

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await dispatch(
        updateOrderStatus({ id: order._id, status: newStatus })
      ).unwrap();
      setCurrentStatus(newStatus);
      alert(t("orderStatusUpdatedTo") + " " + t(newStatus));
    } catch (error) {
      alert(t("failedToUpdateOrderStatus") + " " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div>{t("loading")}</div>;
  if (error)
    return (
      <div>
        {t("error")}: {error}
      </div>
    );
  if (!order) return null;

  const getStatusDetails = (status) => {
    switch (status) {
      case "processing":
        return { text: t("processing"), color: "text-yellow-500" };
      case "shipped":
        return { text: t("shipped"), color: "text-blue-500" };
      case "delivered":
        return { text: t("delivered"), color: "text-green-500" };
      case "cancelled":
        return { text: t("cancelled"), color: "text-red-500" };
      default:
        return { text: t("unknown"), color: "text-gray-500" };
    }
  };

  const getStatusColor = (status) => {
    const { color } = getStatusDetails(status);
    return color;
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString("vi-VN") : t("notSet");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{t("orderDetails")}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">{t("orderSummary")}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <span className="font-semibold">{t("orderId")}:</span> {order._id}
            </p>
            <p>
              <span className="font-semibold">{t("orderDate")}:</span>{" "}
              {formatDate(order.createdAt)}
            </p>
            <p>
              <span className="font-semibold">{t("totalPrice")}:</span>{" "}
              {formatCurrency(order.totalPrice)}
            </p>
            <p>
              <span className="font-semibold">{t("isPaid")}:</span>{" "}
              {order.isPaid ? t("yes") : t("no")}
            </p>
            <p>
              <span className="font-semibold">{t("isDelivered")}:</span>{" "}
              {order.isDelivered ? t("yes") : t("no")}
            </p>
            <p>
              <span className="font-semibold">{t("status")}:</span>{" "}
              <span className={getStatusColor(currentStatus)}>
                {t(currentStatus)}
              </span>
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
                  src={item.image}
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
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("updateOrderStatus")}
          </h2>
          <div className="flex space-x-2">
            {["processing", "shipped", "delivered", "cancelled"].map(
              (status) => {
                const { text, color } = getStatusDetails(status);
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-4 py-2 rounded capitalize ${
                      currentStatus === status
                        ? `${color} bg-opacity-20 font-bold`
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    disabled={currentStatus === status}
                  >
                    {currentStatus === status
                      ? `${t("currentStatus")} ${text}`
                      : `${t("markAsStatus")} ${text}`}
                  </button>
                );
              }
            )}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">{t("orderTimeline")}</h3>
          <div className="relative border-l-2 border-gray-200 ml-3">
            {steps.map((step, index) => {
              const isCompleted =
                steps.findIndex((s) => s.status === currentStatus) >= index;
              const stepDate =
                order[`${step.status}At`] ||
                (step.status === "processing" ? order.createdAt : null);
              return (
                <div
                  key={index}
                  className={`mb-4 flex items-center ${
                    isCompleted ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  <div
                    className={`absolute w-3 h-3 bg-white border-2 rounded-full -left-1.5 ${
                      isCompleted ? "border-green-400" : "border-gray-300"
                    }`}
                  ></div>
                  <div className="ml-6">
                    <p className="font-semibold">{step.label}</p>
                    {stepDate && (
                      <p className="text-sm text-gray-500">
                        {new Date(stepDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {isUpdating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded">
              {t("updatingOrderStatus")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetail;
