import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDateToDisplay } from "../../utils/dateUtils";

interface BookingSummary {
  id: number;
  packageTitle: string;
  travelDate: string;
  bookingDate: string;
  status: string;
}

interface VisaStats {
  active: number;
  underReview: number;
  approved: number;
}

const TouristDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState<BookingSummary[]>([]);
  const [visaStats, setVisaStats] = useState<VisaStats>({
    active: 0,
    underReview: 0,
    approved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load recent bookings
      const bookingsResponse = await apiService.getBookings({ limit: 2 });
      setRecentBookings(bookingsResponse.data.slice(0, 2));

      // Load visa statistics
      try {
        const visaResponse = await apiService.getUserVisaRequests();
        const stats = {
          active: visaResponse.filter(
            (v: any) => v.status === "pending" || v.status === "processing",
          ).length,
          underReview: visaResponse.filter(
            (v: any) => v.status === "under_review",
          ).length,
          approved: visaResponse.filter((v: any) => v.status === "approved")
            .length,
        };
        setVisaStats(stats);
      } catch (error) {
        // Visa feature might not be available yet
        console.error("Failed to load visa stats:", error);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <LoadingSpinner text="Loading your dashboard..." />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
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
                  {user && formatDateToDisplay(user.registrationDate)}
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
                <Link to="/ai-recommendations" className="action-btn">
                  <span className="action-icon">🤖</span>
                  <span className="action-text">AI Travel Assistant</span>
                </Link>
              </div>
            </div>

            {/* My Bookings */}
            <div className="dashboard-card bookings-card">
              <h3>📅 My Bookings</h3>
              {recentBookings.length > 0 ? (
                <div className="booking-list">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="booking-item">
                      <div className="booking-info">
                        <h4>{booking.packageTitle}</h4>
                        <p>
                          Travel Date: {formatDateToDisplay(booking.travelDate)}
                        </p>
                        <small>
                          Booked on {formatDateToDisplay(booking.bookingDate)}
                        </small>
                      </div>
                      <span className={`booking-status ${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">
                  No bookings yet. Start exploring packages!
                </p>
              )}
              <Link to="/tourist/bookings" className="btn btn-outline">
                View All Bookings
              </Link>
            </div>

            {/* Visa Status */}
            <div className="dashboard-card visa-card">
              <h3>🛂 Visa Applications</h3>
              <div className="visa-summary">
                <div className="visa-stat">
                  <span className="stat-number">{visaStats.active}</span>
                  <span className="stat-label">Active Applications</span>
                </div>
                <div className="visa-stat">
                  <span className="stat-number">{visaStats.underReview}</span>
                  <span className="stat-label">Under Review</span>
                </div>
                <div className="visa-stat">
                  <span className="stat-number">{visaStats.approved}</span>
                  <span className="stat-label">Approved</span>
                </div>
              </div>
              <Link to="/visa-status" className="btn btn-outline">
                View Visa Status
              </Link>
            </div>

            {/* Travel Tips */}
            <div className="dashboard-card tips-card">
              <h3>💡 Travel Tips</h3>
              <ul className="tips-list">
                <li>📸 Don't forget your camera for amazing memories!</li>
                <li>🧳 Pack light and smart for comfortable travel</li>
                <li>💳 Keep digital copies of important documents</li>
                <li>🌍 Learn basic local phrases for better experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TouristDashboard;
