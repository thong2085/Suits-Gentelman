// pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import RevenueChart from "../components/RevenueChart";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const { data } = await axios.get("/api/users", config);
      setUsers(data);
    };

    fetchUsers();

    const fetchRevenueData = async () => {
      const { data } = await axios.get("/api/admin/revenue"); // Giả sử có API trả về dữ liệu doanh thu
      setRevenueData(data);
    };

    fetchRevenueData();
    const fetchOrders = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      const { data } = await axios.get("/api/admin/orders", config);
      setOrders(data);
    };

    fetchOrders();
  }, []);
  const updateOrderStatus = async (orderId, isDelivered) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    };

    await axios.put(`/api/admin/orders/${orderId}`, { isDelivered }, config);
    setOrders(
      orders.map((order) =>
        order._id === orderId ? { ...order, isDelivered } : order
      )
    );
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Manage Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order #{order._id} - {order.user.name} -{" "}
            {order.isDelivered ? "Delivered" : "Not Delivered"}
            <button
              onClick={() => updateOrderStatus(order._id, !order.isDelivered)}
            >
              Mark as {order.isDelivered ? "Not Delivered" : "Delivered"}
            </button>
          </li>
        ))}
      </ul>
      <RevenueChart data={revenueData} />
    </div>
  );
}

export default AdminDashboard;
