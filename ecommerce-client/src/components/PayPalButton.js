import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch } from "react-redux";
import { createOrder } from "../features/orders/orderSlice";

const PayPalButton = ({ amount, orderData }) => {
  const dispatch = useDispatch();

  const createPayPalOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      const updatedOrderData = {
        ...orderData,
        paymentResult: {
          id: details.id,
          status: details.status,
          update_time: details.update_time,
          email_address: details.payer.email_address,
        },
      };
      dispatch(createOrder(updatedOrderData));
    });
  };

  return (
    <PayPalButtons createOrder={createPayPalOrder} onApprove={onApprove} />
  );
};

export default PayPalButton;
