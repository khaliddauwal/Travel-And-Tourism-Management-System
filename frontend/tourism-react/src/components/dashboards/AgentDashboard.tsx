import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AgentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="role-dashboard agent-dashboard">
      <div className="dashboard-header">
        <h2>🎯 Agent Dashboard</h2>
        <p>Welcome back, {user?.fullName}! Manage your travel services.</p>
      </div>

      <div className="dashboard-grid">
        {/* Agent Stats */}
        <div className="dashboard-card stats-card">
          <h3>📊 Performance Overview</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">24</span>
              <span className="stat-label">Active Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">12</span>
              <span className="stat-label">Bookings This Month</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">₦850K</span>
              <span className="stat-label">Revenue This Month</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.8</span>
              <span className="stat-label">Customer Rating</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h3>⚡ Agent Tools</h3>
          <div className="action-buttons">
            <Link to="/agent/packages" className="action-btn">
              <span className="action-icon">📦</span>
              <span className="action-text">Manage Packages</span>
            </Link>
            <Link to="/agent/bookings" className="action-btn">
              <span className="action-icon">📅</span>
              <span className="action-text">All Bookings</span>
            </Link>
            <Link to="/agent/customers" className="action-btn">
              <span className="action-icon">👥</span>
              <span className="action-text">Customer Management</span>
            </Link>
            <Link to="/agent/visa" className="action-btn">
              <span className="action-icon">🛂</span>
              <span className="action-text">Visa Requests</span>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="dashboard-card bookings-card">
          <h3>📅 Recent Bookings</h3>
          <div className="booking-list">
            <div className="booking-item">
              <div className="booking-info">
                <h4>Kano Heritage Explorer</h4>
                <p>Amina Abdullahi - ₦35,000</p>
                <small>Booked 2 hours ago</small>
              </div>
              <span className="booking-status confirmed">Confirmed</span>
            </div>
            <div className="booking-item">
              <div className="booking-info">
                <h4>Lagos Business & Culture</h4>
                <p>Fatima Usman - ₦65,000</p>
                <small>Booked yesterday</small>
              </div>
              <span className="booking-status pending">Pending</span>
            </div>
          </div>
          <Link to="/agent/bookings" className="btn btn-outline">
            View All Bookings
          </Link>
        </div>

        {/* Visa Requests */}
        <div className="dashboard-card visa-card">
          <h3>🛂 Visa Management</h3>
          <div className="visa-summary">
            <div className="visa-stat">
              <span className="stat-number">8</span>
              <span className="stat-label">New Requests</span>
            </div>
            <div className="visa-stat">
              <span className="stat-number">15</span>
              <span className="stat-label">In Review</span>
            </div>
            <div className="visa-stat">
              <span className="stat-number">23</span>
              <span className="stat-label">Approved</span>
            </div>
          </div>
          <Link to="/agent/visa" className="btn btn-primary">
            Manage Visa Requests
          </Link>
        </div>

        {/* Customer Insights */}
        <div className="dashboard-card insights-card">
          <h3>👥 Customer Insights</h3>
          <div className="insight-item">
            <span className="insight-label">Most Popular Package:</span>
            <span className="insight-value">Kano Heritage Explorer</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Top Northern Destination:</span>
            <span className="insight-value">Kano, Nigeria</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Average Booking Value:</span>
            <span className="insight-value">₦52,000</span>
          </div>
          <Link to="/agent/analytics" className="btn btn-outline">
            View Analytics
          </Link>
        </div>

        {/* Tasks & Reminders */}
        <div className="dashboard-card tasks-card">
          <h3>✅ Tasks & Reminders</h3>
          <div className="task-list">
            <div className="task-item">
              <input type="checkbox" id="task1" />
              <label htmlFor="task1">
                Follow up with Amina Abdullahi about visa status
              </label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task2" />
              <label htmlFor="task2">
                Update package prices for Harmattan season
              </label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task3" />
              <label htmlFor="task3">
                Review customer feedback from last week
              </label>
            </div>
          </div>
          <button className="btn btn-outline">Add New Task</button>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
