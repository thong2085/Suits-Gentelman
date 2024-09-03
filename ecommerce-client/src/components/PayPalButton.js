import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch } from "react-redux";
import { createOrder } from "../features/orders/orderSlice";
import { useNavigate } from "react-router-dom";

const PayPalButton = ({ amount }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount,
              },
            },
          ],
        });
      }}
      onApprove={(data, actions) => {
        return actions.order.capture().then((details) => {
          // Create order after successful payment
          const orderData = {
            orderItems: [], // You need to get this from your cart state
            shippingAddress: {}, // You need to get this from your form state
            paymentMethod: "PayPal",
            totalPrice: amount,
            paymentResult: details,
          };
          dispatch(createOrder(orderData)).then((resultAction) => {
            const order = resultAction.payload;
            navigate(`/order/${order._id}`);
          });
        });
      }}
    />
  );
};

export default PayPalButton;
