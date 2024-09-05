import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders } from "../../features/orders/orderSlice";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatCurrency";

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
      case "processing":
        return "text-yellow-600";
      case "shipped":
        return "text-blue-600";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
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
              <th>{t("image")}</th>
              <th>{t("total")}</th>
              <th>{t("paid")}</th>
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
                <td>
                  <img
                    src={
                      Array.isArray(order.orderItems[0].images)
                        ? order.orderItems[0].images[0]
                        : order.orderItems[0].images
                    }
                    alt={order.name}
                    className="w-10 h-10 object-cover"
                  />
                </td>
                <td>{formatCurrency(order.totalPrice)}</td>
                <td>{order.isPaid ? t("yes") : t("no")}</td>
                <td>{t(order.paymentMethod)}</td>
                <td>
                  <span className={`${getStatusColor(order.status)} font-bold`}>
                    {t(order.status)}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/admin/orders/${order.orderCode}`}
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
