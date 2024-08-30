// components/Wishlist.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      const { data } = await axios.get("/api/users/wishlist", config);
      setWishlist(data);
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    await axios.delete(`/api/users/wishlist/${productId}`, config);
    setWishlist(wishlist.filter((item) => item._id !== productId));
  };

  return (
    <div>
      <h2>Your Wishlist</h2>
      <ul>
        {wishlist.map((item) => (
          <li key={item._id}>
            <img src={item.image} alt={item.name} width="50" />
            <p>{item.name}</p>
            <p>{item.price}</p>
            <button onClick={() => removeFromWishlist(item._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wishlist;
