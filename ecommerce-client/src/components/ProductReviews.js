import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviews, addReview } from "../features/products/productSlice";
import { useTranslation } from "react-i18next";

const ProductReviews = React.memo(({ productId }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { reviews, reviewsLoading, reviewsError } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    dispatch(getReviews(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    // Check if the user has already reviewed this product
    if (reviews && reviews.length > 0 && user) {
      const userReview = reviews.find((review) => review.user === user._id);
      setUserHasReviewed(!!userReview);
    }
  }, [reviews, user]);

  const handleSubmitReview = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(addReview({ productId, rating, comment }))
        .unwrap()
        .then(() => {
          setRating(5);
          setComment("");
          setSubmitError(null);
          setUserHasReviewed(true);
          dispatch(getReviews(productId));
        })
        .catch((error) => {
          console.error("Error submitting review:", error);
          setSubmitError(
            error.message || "An error occurred while submitting the review."
          );
        });
    },
    [dispatch, productId, rating, comment]
  );

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (reviewsLoading)
    return <div className="text-center py-4">Loading reviews...</div>;
  if (reviewsError)
    return (
      <div className="text-center py-4 text-red-500">
        Error loading reviews: {reviewsError}
      </div>
    );

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 border-b pb-2">
        {t("Customer Reviews")}
      </h3>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{review.name}</p>
                <div className="text-yellow-400">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          {t("No reviews yet. Be the first to review this product!")}
        </p>
      )}
      {user && !userHasReviewed ? (
        <form onSubmit={handleSubmitReview} className="mt-8">
          <h4 className="text-xl font-semibold mb-4">{t("Write a Review")}</h4>
          {submitError && <p className="text-red-500 mb-4">{submitError}</p>}
          <div className="mb-4">
            <label htmlFor="rating" className="block mb-2 font-medium">
              {t("Rating:")}
            </label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`text-2xl ${
                    value <= rating ? "text-yellow-400" : "text-gray-300"
                  } focus:outline-none`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block mb-2 font-medium">
              {t("Your Review:")}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            {t("submitReview")}
          </button>
        </form>
      ) : user ? (
        <p className="mt-8 text-green-600">{t("Thank you for your review!")}</p>
      ) : (
        <p className="mt-8 text-blue-600">
          {t("Please log in to leave a review.")}
        </p>
      )}
    </div>
  );
});

export default ProductReviews;
