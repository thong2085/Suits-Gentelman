const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const { client } = require("../config/paypal");

// Tạo thanh toán mới
const createPayment = async (req, res) => {
  const { amount } = req.body; // Số tiền thanh toán từ phía client

  try {
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
      application_context: {
        return_url: "http://localhost:5000/api/payment/capture",
        cancel_url: "http://localhost:5000/api/payment/cancel",
      },
    });

    const order = await client().execute(request);

    res.status(200).json({ id: order.result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xác nhận thanh toán
const capturePayment = async (req, res) => {
  const { orderId } = req.query; // Lấy orderId từ query params

  try {
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client().execute(request);

    res.status(200).json({ capture });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPayment, capturePayment };
