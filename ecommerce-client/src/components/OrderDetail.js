import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderById } from "../features/orders/orderSlice";

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, isLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return null;

  return (
    <div>
      <h2>Order #{order._id}</h2>
      <p>Total Price: ${order.totalPrice}</p>
      <p>Status: {order.isPaid ? "Paid" : "Not Paid"}</p>
      <h3>Order Items:</h3>
      <ul>
        {order.orderItems.map((item) => (
          <li key={item._id}>
            {item.name} - Quantity: {item.qty}, Price: ${item.price}
          </li>
        ))}
      </ul>
      {/* Add more order details */}
    </div>
  );
};

export default OrderDetail;
