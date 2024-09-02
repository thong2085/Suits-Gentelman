import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderById } from "../features/orders/orderSlice";

const OrderDetailPage = () => {
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
        <div className="grid grid-cols-2 gap-4">
          <div>
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
              <span className="font-semibold">Is Paid:</span>{" "}
              {order.isPaid ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-semibold">Is Delivered:</span>{" "}
              {order.isDelivered ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}{" "}
              {order.shippingAddress.country}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Order Items</h3>
          <ul>
            {order.orderItems.map((item) => (
              <li key={item._id} className="flex items-center mb-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded mr-4"
                />
                <div className="flex-grow">
                  <span className="block">{item.name}</span>
                  <span className="block">Quantity: {item.quantity}</span>
                  <span className="block">Price: ${item.price.toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <p>Items: ${order.itemsPrice.toFixed(2)}</p>
            <p>Shipping: ${order.shippingPrice.toFixed(2)}</p>
            <p>Tax: ${order.taxPrice.toFixed(2)}</p>
            <p className="text-xl font-bold mt-4">
              Total: ${order.totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
