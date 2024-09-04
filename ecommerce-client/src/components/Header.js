import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { logout } from "../features/auth/authSlice";
import {
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/image/logo.png";

const Header = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart); // Thêm dòng này
  const [orderId, setOrderId] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleOrderSearch = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/order/${orderId.trim()}`);
    }
  };

  return (
    <header className="shadow-lg mb-8 ">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight hover:text-secondary transition duration-300"
        >
          <img src={logo} alt="logo" className="w-24" />
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link
                to="/products"
                className="hover:text-secondary transition duration-300"
              >
                {t("products")}
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="flex items-center hover:text-secondary transition duration-300"
              >
                <ShoppingCartIcon className="w-5 h-5 mr-1" />
                {cartItems.length > 0 && (
                  <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </li>
            {userInfo ? (
              <>
                <li>
                  <form onSubmit={handleOrderSearch} className="flex">
                    <input
                      type="text"
                      placeholder={t("enterOrderId")}
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="px-2 py-1 rounded-l border-r-0"
                    />
                    <button
                      type="submit"
                      className="btn btn-primary px-2 py-1 rounded-r transition duration-300"
                    >
                      {t("search")}
                    </button>
                  </form>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center hover:text-secondary transition duration-300"
                  >
                    <UserCircleIcon className="w-5 h-5 mr-1" />
                    {t("profile")}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-1" />
                    {t("logout")}
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="flex items-center hover:text-secondary transition duration-300"
                >
                  <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-1" />
                  {t("login")}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
