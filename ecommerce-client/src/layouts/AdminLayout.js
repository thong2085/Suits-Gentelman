import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const AdminLayout = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { to: "/admin", text: "dashboard", icon: HomeIcon },
    { to: "/admin/products", text: "products", icon: CubeIcon },
    { to: "/admin/orders", text: "orders", icon: ShoppingCartIcon },
    { to: "/admin/users", text: "users", icon: UsersIcon },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`${
          isExpanded ? "w-64" : "w-20"
        } bg-gray-800 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isExpanded && (
            <h2 className="text-white font-semibold">Admin Control Panel</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-700"
          >
            {isExpanded ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
        <nav className="mt-5">
          <ul>
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center py-3 px-4 hover:bg-gray-700 transition-colors ${
                    isExpanded ? "justify-start" : "justify-center"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  {isExpanded && <span className="ml-3">{t(item.text)}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 mt-10">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
