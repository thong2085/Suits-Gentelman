// components/ProductReviews.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await axios.get(`/api/products/${productId}/reviews`);
      setReviews(data);
    };

    fetchReviews();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      await axios.post(
        `/api/products/${productId}/reviews`,
        { rating, comment },
        config
      );
      setMessage("Review added successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      setMessage("Error adding review");
    }
  };

  return (
    <div>
      <h2>Reviews</h2>
      {message && <p>{message}</p>}
      <ul>
        {reviews.map((review) => (
          <li key={review._id}>
            <strong>{review.name}</strong>
            <p>{review.rating} stars</p>
            <p>{review.comment}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={submitHandler}>
        <div>
          <label>Rating</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">Select...</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
        <div>
          <label>Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProductReviews;
