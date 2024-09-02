import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <aside className="w-64 min-h-screen bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/admin" className="hover:text-gray-300">
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/products" className="hover:text-gray-300">
                Products
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/orders" className="hover:text-gray-300">
                Orders
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/users" className="hover:text-gray-300">
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
