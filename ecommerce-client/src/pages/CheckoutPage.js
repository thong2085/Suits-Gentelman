import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { clearCart } from "../features/cart/cartSlice";
import { createOrder } from "../features/orders/orderSlice";
import PayPalButton from "../components/PayPalButton";

const CheckoutPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod !== "PayPal") {
      placeOrder();
    }
  };

  const placeOrder = async (paymentResult = null) => {
    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice: cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      shippingPrice: 0, // Bạn có thể tính toán giá vận chuyển ở đây
      taxPrice: 0, // Bạn có thể tính toán thuế ở đây
      totalPrice: cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      paymentResult,
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate(`/order/${result._id}`);
    } catch (error) {
      console.error(t("failedToPlaceOrder"), error);
      // Hiển thị thông báo lỗi cho người dùng
    }
  };

  const handlePayPalSuccess = (paymentResult) => {
    console.log(t("paymentSuccessful"), paymentResult);
    placeOrder(paymentResult);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("checkout")}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{t("shippingAddress")}</h2>
          <input
            type="text"
            name="address"
            value={shippingAddress.address}
            onChange={handleInputChange}
            placeholder={t("address")}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleInputChange}
            placeholder={t("city")}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            name="postalCode"
            value={shippingAddress.postalCode}
            onChange={handleInputChange}
            placeholder={t("postalCode")}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            name="country"
            value={shippingAddress.country}
            onChange={handleInputChange}
            placeholder={t("country")}
            className="w-full p-2 border rounded mb-2"
            required
          />
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{t("paymentMethod")}</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="PayPal">PayPal</option>
            <option value="COD">{t("cashOnDelivery")}</option>
          </select>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{t("orderSummary")}</h2>
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between mb-2">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="font-bold mt-4">
            {t("total")}: $
            {cartItems
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toFixed(2)}
          </div>
        </div>
        {paymentMethod === "PayPal" ? (
          sdkReady ? (
            <PayPalButton
              amount={cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              )}
              onSuccess={handlePayPalSuccess}
            />
          ) : (
            <p>{t("loadingPayPal")}</p>
          )
        ) : (
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {t("placeOrder")}
          </button>
        )}
      </form>
    </div>
  );
};

export default CheckoutPage;
