import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const OrderConfirmationPage = () => {
  const { order } = useSelector((state) => state.orders);

  if (!order) {
    return (
      <div>
        No order found. <Link to="/">Go to homepage</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
      <div
        className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8"
        role="alert"
      >
        <p className="font-bold">Thank you for your order!</p>
        <p>Your order number is: {order._id}</p>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
      <div className="mb-8">
        {order.orderItems.map((item) => (
          <div key={item._id} className="flex items-center border-b py-4">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-24 h-24 object-cover mr-4"
            />
            <div>
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-gray-600">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
        <p>{order.shippingAddress.address}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.postalCode}
        </p>
        <p>{order.shippingAddress.country}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        <p>Total: ${order.totalPrice.toFixed(2)}</p>
      </div>
      <Link
        to="/"
        className="bg-blue-500 text-white px-4 py-2 rounded mt-8 inline-block"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmationPage;
