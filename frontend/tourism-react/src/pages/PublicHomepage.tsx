import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService, Package } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

interface Review {
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
}

const PublicHomepage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedPackages();
    loadReviews();
  }, []);

  const loadFeaturedPackages = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFeaturedPackages(3);
      setFeaturedPackages(response);
    } catch (error) {
      console.error("Failed to load featured packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await apiService.getRecentReviews(6);
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const features = [
    {
      icon: "🌍",
      title: "Global Destinations",
      description:
        "Access to hundreds of curated travel experiences across the world",
    },
    {
      icon: "💳",
      title: "Secure Payments",
      description:
        "Safe and encrypted payment processing for worry-free bookings",
    },
    {
      icon: "📞",
      title: "24/7 Support",
      description:
        "Round-the-clock customer service to assist with your travel needs",
    },
    {
      icon: "⭐",
      title: "Best Price Guarantee",
      description:
        "Competitive pricing with no hidden fees or surprise charges",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/packages?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="public-homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Discover Your Next Adventure</h1>
            <p className="hero-subtitle">
              Explore amazing destinations worldwide. Book unforgettable
              experiences with confidence.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hero-search">
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                🔍 Search Destinations
              </button>
            </form>

            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/packages" className="btn btn-outline btn-lg">
                Browse Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Destinations</h2>
            <p>Handpicked travel experiences for your next journey</p>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading featured packages..." />
          ) : featuredPackages.length > 0 ? (
            <div className="destinations-grid">
              {featuredPackages.map((pkg) => (
                <div key={pkg.id} className="destination-card">
                  <div className="destination-image">
                    <img src={pkg.image} alt={pkg.name} />
                    <div className="destination-badge">Available</div>
                    <div className="destination-rating">⭐ 4.8</div>
                  </div>

                  <div className="destination-content">
                    <h3>{pkg.name}</h3>
                    <span className="destination-location">
                      📍 {pkg.location}
                    </span>
                    <p>{pkg.details.substring(0, 100)}...</p>

                    <div className="destination-footer">
                      <div className="price-duration">
                        <span className="price">{pkg.price.formatted}</span>
                        <span className="duration">{pkg.type}</span>
                      </div>
                      <Link
                        to={`/packages/${pkg.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">
              No featured packages available at the moment.
            </p>
          )}

          <div className="section-cta">
            <Link to="/packages" className="btn btn-outline">
              View All Destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Us</h2>
            <p>Your trusted partner for unforgettable travel experiences</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traveler Reviews */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Travelers Say</h2>
            <p>Real experiences from real travelers</p>
          </div>

          {reviewsLoading ? (
            <LoadingSpinner text="Loading reviews..." />
          ) : reviews.length > 0 ? (
            <div className="testimonials-grid">
              {reviews.map((review, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-rating">
                    {"⭐".repeat(Math.min(review.rating, 5))}
                  </div>
                  <p className="testimonial-comment">"{review.comment}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {review.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="author-info">
                      <strong>{review.user_name}</strong>
                      <span>Verified Traveler</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="reviews-empty-state">
              <div className="reviews-empty-icon">✈️</div>
              <h3>Be the first to share your experience!</h3>
              <p>
                Book a package, complete your trip, and leave a review to help
                other travelers.
              </p>
              <Link to="/packages" className="btn btn-primary">
                Browse Packages
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Our Travel Platform</h2>
              <p>
                We are a leading travel and tourism management platform
                dedicated to making your travel dreams a reality. With years of
                experience and a passion for exploration, we curate the best
                travel experiences from around the world.
              </p>
              <p>
                Our platform connects travelers with authentic destinations,
                professional guides, and unforgettable experiences. Whether
                you're seeking adventure, relaxation, or cultural immersion, we
                have the perfect package for you.
              </p>
              <Link to="/about" className="btn btn-outline">
                Learn More About Us
              </Link>
            </div>
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=400&fit=crop"
                alt="Travel"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Join thousands of satisfied travelers and book your next adventure
              today
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicHomepage;
