import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderById } from "../features/orders/orderSlice";

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <p>
          <span className="font-semibold">Order ID:</span> {order._id}
        </p>
        <p>
          <span className="font-semibold">Order Date:</span>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Total Price:</span> $
          {order.totalPrice.toFixed(2)}
        </p>
        <p>
          <span className="font-semibold">Payment Method:</span>{" "}
          {order.paymentMethod}
        </p>
        <p>
          <span className="font-semibold">Payment Status:</span>{" "}
          {order.isPaid ? "Paid" : "Not Paid"}
        </p>
        <p>
          <span className="font-semibold">Delivery Status:</span>{" "}
          {order.isDelivered ? "Delivered" : "Not Delivered"}
        </p>
        <p>
          <span className="font-semibold">Order Status:</span>{" "}
          <span
            className={`capitalize ${
              order.status === "delivered"
                ? "text-green-500"
                : order.status === "shipped"
                ? "text-blue-500"
                : "text-yellow-500"
            }`}
          >
            {order.status}
          </span>
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Shipping Address</h3>
        <p>{order.shippingAddress.address}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.postalCode}
        </p>
        <p>{order.shippingAddress.country}</p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Order Items</h3>
        <ul>
          {order.orderItems.map((item) => (
            <li key={item._id} className="mb-2">
              <span>{item.name}</span> -{" "}
              <span>
                {item.quantity} x ${item.price.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetail;
