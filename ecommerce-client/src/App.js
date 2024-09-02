import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductList from "./pages/admin/ProductList";
import OrderList from "./pages/admin/OrderList";
import UserList from "./pages/admin/UserList";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import UserProfilePage from "./pages/UserProfilePage";
import OrderListPage from "./pages/OrderListPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route
            path="order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="orders" element={<OrderListPage />} />
          <Route path="order/:id" element={<OrderDetailPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="category/:category" element={<CategoryPage />} />
        </Route>

        <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="users" element={<UserList />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
