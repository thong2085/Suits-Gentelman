// App.js
import React, { useEffect } from "react";
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Địa chỉ backend
const stripePromise = loadStripe("your-publishable-key-here");
function App() {
  useEffect(() => {
    // Lắng nghe sự kiện 'newOrder'
    socket.on("newOrder", (order) => {
      console.log("New order received:", order);
      alert(`New order received: ${order._id}`);
    });

    // Lắng nghe sự kiện 'orderStatusChanged'
    socket.on("orderStatusChanged", (order) => {
      console.log("Order status changed:", order);
      alert(`Order status changed for order: ${order._id}`);
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderStatusChanged");
    };
  }, []);
  return (
    <Router>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <Elements stripe={stripePromise}>
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/product/:id" element={<ProductPage />} />
          {/* <Route path="/cart" element={<CartPage />} /> */}
          {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
        </Routes>
      </Elements>
      {/* </Suspense> */}
    </Router>
  );
}

export default App;
