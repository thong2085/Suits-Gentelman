import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { logout } from "../features/auth/authSlice";
import {
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowRightEndOnRectangleIcon,
  HomeIcon,
  ShoppingBagIcon,
  Bars3Icon, // Thay đổi này
} from "@heroicons/react/24/outline";
import logo from "../assets/image/logo.png";

const Header = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [orderId, setOrderId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="shadow-lg mb-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-3xl font-bold tracking-tight hover:text-secondary transition duration-300"
          >
            <img src={logo} alt="logo" className="w-24" />
          </Link>
          <nav className="hidden sm:block">
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
          <button className="sm:hidden" onClick={toggleMenu}>
            <Bars3Icon className="w-6 h-6" /> {/* Thay đổi này */}
          </button>
        </div>
      </header>

      {/* Mobile bottom menu */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg sm:hidden z-[9998]">
        <ul className="flex justify-around items-center py-2">
          <li>
            <Link to="/" className="flex flex-col items-center">
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">{t("home")}</span>
            </Link>
          </li>
          <li>
            <Link to="/products" className="flex flex-col items-center">
              <ShoppingBagIcon className="w-6 h-6" />
              <span className="text-xs">{t("products")}</span>
            </Link>
          </li>
          <li>
            <Link to="/cart" className="flex flex-col items-center">
              <ShoppingCartIcon className="w-6 h-6" />
              <span className="text-xs">{t("cart")}</span>
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-24 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </li>
          <li>
            <button onClick={toggleMenu} className="flex flex-col items-center">
              <Bars3Icon className="w-6 h-6" /> {/* Thay đổi này */}
              <span className="text-xs">{t("more")}</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile slide-up menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            ref={menuRef}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg p-4 z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-4">
              {userInfo ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center"
                      onClick={toggleMenu}
                    >
                      <UserCircleIcon className="w-5 h-5 mr-2" />
                      {t("profile")}
                    </Link>
                  </li>
                  <li>
                    <form onSubmit={handleOrderSearch} className="flex">
                      <input
                        type="text"
                        placeholder={t("enterOrderId")}
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="flex-grow px-2 py-1 rounded-l border-r-0"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary px-2 py-1 rounded-r transition duration-300"
                        onClick={toggleMenu}
                      >
                        {t("search")}
                      </button>
                    </form>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="flex items-center text-red-500"
                    >
                      <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-2" />
                      {t("logout")}
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="flex items-center"
                    onClick={toggleMenu}
                  >
                    <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-2" />
                    {t("login")}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
