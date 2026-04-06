import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TouristDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="role-dashboard tourist-dashboard">
      <div className="dashboard-header">
        <h2>🧳 Tourist Dashboard</h2>
        <p>Welcome back, {user?.fullName}! Plan your next adventure.</p>
      </div>

      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="dashboard-card profile-card">
          <h3>👤 Your Profile</h3>
          <div className="profile-info">
            <p>
              <strong>Name:</strong> {user?.fullName}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Mobile:</strong> {user?.mobileNumber}
            </p>
            <p>
              <strong>Member Since:</strong>{" "}
              {user && new Date(user.registrationDate).toLocaleDateString()}
            </p>
          </div>
          <Link to="/profile" className="btn btn-outline">
            Edit Profile
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h3>⚡ Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/packages" className="action-btn">
              <span className="action-icon">🏖️</span>
              <span className="action-text">Browse Packages</span>
            </Link>
            <Link to="/visa-request" className="action-btn">
              <span className="action-icon">🛂</span>
              <span className="action-text">Request Visa</span>
            </Link>
            <Link to="/visa-status" className="action-btn">
              <span className="action-icon">📋</span>
              <span className="action-text">Check Visa Status</span>
            </Link>
          </div>
        </div>

        {/* My Bookings */}
        <div className="dashboard-card bookings-card">
          <h3>📅 My Bookings</h3>
          <div className="bookings-summary">
            <div className="booking-stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Active Bookings</span>
            </div>
            <div className="booking-stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Completed Trips</span>
            </div>
          </div>
          <div className="empty-state">
            <p>No bookings yet. Start exploring our amazing packages!</p>
            <Link to="/packages" className="btn btn-primary">
              Browse Packages
            </Link>
          </div>
        </div>

        {/* Visa Status */}
        <div className="dashboard-card visa-card">
          <h3>🛂 Visa Applications</h3>
          <div className="visa-summary">
            <div className="visa-stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="visa-stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Approved</span>
            </div>
          </div>
          <div className="visa-actions">
            <Link to="/visa-request" className="btn btn-primary">
              New Request
            </Link>
            <Link to="/visa-status" className="btn btn-outline">
              View All
            </Link>
          </div>
        </div>

        {/* Travel Tips */}
        <div className="dashboard-card tips-card">
          <h3>💡 Travel Tips</h3>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">📱</span>
              <span className="tip-text">
                Download offline maps before traveling
              </span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">💳</span>
              <span className="tip-text">
                Notify your bank about travel plans
              </span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🏥</span>
              <span className="tip-text">Check vaccination requirements</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="dashboard-card recommendations-card">
          <h3>🌟 Recommended for You</h3>
          <div className="recommendation-item">
            <img
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=80&fit=crop"
              alt="Kano Heritage"
              className="recommendation-image"
            />
            <div className="recommendation-content">
              <h4>Kano Heritage Explorer</h4>
              <p>₦35,000</p>
              <Link to="/packages/1" className="btn btn-sm btn-primary">
                View Details
              </Link>
            </div>
          </div>
          <div className="recommendation-item" style={{ marginTop: "1rem" }}>
            <img
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=80&fit=crop"
              alt="Lagos Business"
              className="recommendation-image"
            />
            <div className="recommendation-content">
              <h4>Lagos Business Tour</h4>
              <p>₦65,000</p>
              <Link to="/packages/2" className="btn btn-sm btn-outline">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;
