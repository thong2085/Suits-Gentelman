import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders } from "../../features/orders/orderSlice";
import { useTranslation } from "react-i18next";

const OrderList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <div>{t("loading")}</div>;
  if (error)
    return (
      <div>
        {t("error")}: {error}
      </div>
    );

  const getUserInfo = (order) => {
    if (order.user) {
      return order.user.name;
    } else if (order.shippingAddress) {
      return `${order.shippingAddress.city}, ${order.shippingAddress.country}`;
    } else {
      return t("na");
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Đã xử lý":
        return "bg-blue-100 text-blue-800";
      case "Đã gửi":
        return "bg-yellow-100 text-yellow-800";
      case "Đã giao":
        return "bg-green-100 text-green-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("orderList")}</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t("orderId")}</th>
              <th>{t("user")}</th>
              <th>{t("date")}</th>
              <th>{t("total")}</th>
              <th>{t("paid")}</th>
              <th>{t("delivered")}</th>
              <th>{t("paymentMethod")}</th>
              <th>{t("status")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td title={order._id}>{order._id}</td>
                <td>{getUserInfo(order)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? t("yes") : t("no")}</td>
                <td>{order.isDelivered ? t("yes") : t("no")}</td>
                <td>{t(order.paymentMethod)}</td>
                <td>{t(order.status)}</td>
                <td>
                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {t("details")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
