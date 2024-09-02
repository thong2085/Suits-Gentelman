import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PayPalButton from "../components/PayPalButton";
import { createOrder } from "../features/orders/orderSlice";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const orderData = {
    orderItems: cartItems,
    shippingAddress,
    totalPrice,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form className="max-w-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
        {/* ... your existing shipping address form fields */}
      </form>
      <div className="mt-8">
        <p className="text-xl font-bold mb-4">
          Total: ${totalPrice.toFixed(2)}
        </p>
        <PayPalButton amount={totalPrice} orderData={orderData} />
      </div>
    </div>
  );
};

export default CheckoutPage;
