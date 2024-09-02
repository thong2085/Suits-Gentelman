import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const cart = useSelector((state) => state.cart);
  const cartItems = cart?.cartItems || [];
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight hover:text-blue-200 transition duration-300"
        >
          E-Shop
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link
                to="/products"
                className="hover:text-blue-200 transition duration-300"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="flex items-center hover:text-blue-200 transition duration-300"
              >
                <div className="w-5 h-5 mr-1">
                  <ShoppingCartIcon />
                </div>
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                  {cartItems.length}
                </span>
              </Link>
            </li>
            {userInfo ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center hover:text-blue-200 transition duration-300"
                  >
                    <div className="w-5 h-5 mr-1">
                      <UserCircleIcon />
                    </div>
                    Profile
                  </Link>
                </li>
                <li>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="flex items-center hover:text-blue-200 transition duration-300"
                >
                  <div className="w-5 h-5 mr-1">
                    <ArrowRightEndOnRectangleIcon />
                  </div>
                  Login
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
