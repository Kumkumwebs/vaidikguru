import React from "react";

const UserReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="container mt-60">
      <div className="review-wrapper">
        <h2 className="box-title text-center mb-40">
          Devotee Experiences & Reviews
        </h2>

        <div className="review-grid">
          {reviews.map((review, index) => (
            <div className="review-card" key={index}>
              {/* HEADER */}
              <div className="review-header">
                <img
                  src={review.userImage || "/assets/img/user/default-user.png"}
                  alt={review.userName}
                  className="review-avatar"
                />

                <div className="review-user">
                  <h4>{review.userName}</h4>
                  <span>{review.location || "India"}</span>
                </div>
              </div>

              {/* RATING */}
              <div className="review-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i
                    key={i}
                    className={`fa-solid fa-star ${
                      i < review.rating ? "active" : ""
                    }`}
                  ></i>
                ))}
              </div>

              {/* CONTENT */}
              <p className="review-text">
                {review.comment}
              </p>

              {/* FOOTER */}
              <div className="review-footer">
                <span className="review-date">
                  {new Date(review.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="review-verified">
                  ✔ Verified Devotee
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserReviews;
