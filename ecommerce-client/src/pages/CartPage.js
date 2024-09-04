import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../features/cart/cartSlice";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/formatCurrency";

const CartPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("yourCart")}</h1>
      {cartItems.length === 0 ? (
        <p>
          {t("emptyCart")}{" "}
          <Link to="/products" className="text-blue-500">
            {t("goShopping")}
          </Link>
        </p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center border-b py-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover mr-4"
              />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600">{formatCurrency(item.price)}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity - 1)
                    }
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity + 1)
                    }
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleRemoveItem(item._id)}
                className="text-red-500"
              >
                {t("remove")}
              </button>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-xl font-bold">
              {t("total")}: {formatCurrency(totalPrice)}
            </p>
            <button
              onClick={handleCheckout}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block"
            >
              {t("proceedToCheckout")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
