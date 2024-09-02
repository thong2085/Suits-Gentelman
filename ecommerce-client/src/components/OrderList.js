import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders } from "../features/orders/orderSlice";

const OrderList = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <Link to={`/order/${order._id}`}>Order #{order._id}</Link> - $
            {order.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
