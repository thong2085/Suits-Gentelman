import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../features/auth/authSlice";

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    dispatch(updateUserProfile({ id: userInfo._id, name, email, password }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default UserProfilePage;
