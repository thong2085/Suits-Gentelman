// src/components/PayPalButton.js
import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

// Cung cấp client ID qua biến môi trường
const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const PayPalButton = ({ amount, onSuccess }) => {
  return (
    <PayPalScriptProvider options={{ "client-id": clientId }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: amount,
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();
          onSuccess(order);
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
