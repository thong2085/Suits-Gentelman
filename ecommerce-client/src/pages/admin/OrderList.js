import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders } from "../../features/orders/orderSlice";

const OrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  console.log("Orders:", orders);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const getUserInfo = (order) => {
    if (order.user) {
      return order.user.name;
    } else if (order.shippingAddress) {
      return `${order.shippingAddress.city}, ${order.shippingAddress.country}`;
    } else {
      return "N/A";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order List</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Total</th>
            <th className="py-2 px-4 border-b">Paid</th>
            <th className="py-2 px-4 border-b">Delivered</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="py-2 px-4 border-b">{order._id}</td>
              <td className="py-2 px-4 border-b">{getUserInfo(order)}</td>
              <td className="py-2 px-4 border-b">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">
                ${order.totalPrice.toFixed(2)}
              </td>
              <td className="py-2 px-4 border-b">
                {order.isPaid ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b">
                {order.isDelivered ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b">
                <Link
                  to={`/admin/orders/${order._id}`}
                  className="text-blue-500 hover:underline"
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
