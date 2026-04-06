import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/Toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

interface Review {
  id: number;
  userId: number;
  packageId: number;
  bookingId: number;
  userFullName: string;
  packageTitle: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

interface ReviewSystemProps {
  packageId?: number;
  bookingId?: number;
  showForm?: boolean;
  showReviews?: boolean;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({
  packageId,
  bookingId,
  showForm = true,
  showReviews = true,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    comment: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: 1,
      userId: 1,
      packageId: 1,
      bookingId: 1,
      userFullName: "Sarah Johnson",
      packageTitle: "Lagos City Explorer",
      rating: 5,
      comment:
        "Amazing experience! The tour guide was knowledgeable and the locations were breathtaking. Highly recommended for anyone visiting Lagos.",
      status: "approved",
      createdAt: "2024-01-20T10:30:00Z",
      updatedAt: "2024-01-20T10:30:00Z",
    },
    {
      id: 2,
      userId: 2,
      packageId: 1,
      bookingId: 2,
      userFullName: "Michael Chen",
      packageTitle: "Lagos City Explorer",
      rating: 4,
      comment:
        "Great tour overall. The Victoria Island visit was fantastic. Only minor issue was the timing - we felt a bit rushed at some locations.",
      status: "approved",
      createdAt: "2024-01-18T14:20:00Z",
      updatedAt: "2024-01-18T14:20:00Z",
    },
    {
      id: 3,
      userId: 3,
      packageId: 1,
      bookingId: 3,
      userFullName: "Amina Abdullahi",
      packageTitle: "Lagos City Explorer",
      rating: 5,
      comment:
        "Excellent service from start to finish. The team was professional and accommodating. The cultural sites were well-chosen and informative.",
      status: "approved",
      createdAt: "2024-01-15T09:15:00Z",
      updatedAt: "2024-01-15T09:15:00Z",
    },
  ];

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReviews(
        mockReviews.filter(
          (review) => !packageId || review.packageId === packageId,
        ),
      );
    } catch (error) {
      showToast("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  }, [packageId, showToast]);

  useEffect(() => {
    if (showReviews) {
      loadReviews();
    }
  }, [loadReviews, showReviews]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5 stars";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Review comment is required";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Review must be at least 10 characters long";
    } else if (formData.comment.trim().length > 500) {
      newErrors.comment = "Review must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const reviewData = {
        packageId: packageId || 1,
        bookingId: bookingId || 1,
        rating: formData.rating,
        comment: formData.comment.trim(),
        userId: user?.email,
        userFullName: user?.fullName,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showToast(
        "Review submitted successfully! It will be published after moderation.",
        "success",
      );

      // Reset form
      setFormData({ rating: 5, comment: "" });

      // Reload reviews
      if (showReviews) {
        loadReviews();
      }
    } catch (error) {
      showToast("Failed to submit review. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onChange?: (rating: number) => void,
  ) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "filled" : ""} ${interactive ? "interactive" : ""}`}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const getAverageRating = (): string => {
    if (reviews.length === 0) return "0";
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  return (
    <div className="review-system">
      {showReviews && (
        <div className="reviews-section">
          <div className="reviews-header">
            <h3>⭐ Customer Reviews</h3>
            {reviews.length > 0 && (
              <div className="rating-summary">
                <div className="average-rating">
                  <span className="rating-number">{getAverageRating()}</span>
                  {renderStars(Math.round(parseFloat(getAverageRating())))}
                  <span className="review-count">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center">
              <LoadingSpinner />
              <p>Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <strong>{review.userFullName}</strong>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      )}

      {showForm && user && (
        <div className="review-form-section">
          <h3>✍️ Write a Review</h3>
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label>
                Rating <span className="required">*</span>
              </label>
              <div className="rating-input">
                {renderStars(formData.rating, true, (rating) =>
                  setFormData((prev) => ({ ...prev, rating })),
                )}
                <span className="rating-text">
                  {formData.rating} out of 5 stars
                </span>
              </div>
              {errors.rating && (
                <span className="error-message">{errors.rating}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="comment">
                Your Review <span className="required">*</span>
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Share your experience with this package. What did you like? What could be improved?"
                rows={4}
                disabled={submitting}
              />
              <div className="character-count">
                {formData.comment.length}/500 characters
              </div>
              {errors.comment && (
                <span className="error-message">{errors.comment}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? <LoadingSpinner /> : "📝 Submit Review"}
            </button>
          </form>
        </div>
      )}

      {!user && showForm && (
        <div className="login-prompt">
          <p>
            Please <a href="/login">login</a> to write a review.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewSystem;
