import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="role-dashboard admin-dashboard">
      <div className="dashboard-header">
        <h2>👑 Admin Dashboard</h2>
        <p>Welcome back, {user?.fullName}! System overview and management.</p>
      </div>

      <div className="dashboard-grid">
        {/* System Overview */}
        <div className="dashboard-card overview-card">
          <h3>🏢 System Overview</h3>
          <div className="overview-stats">
            <div className="overview-item">
              <span className="overview-number">1,247</span>
              <span className="overview-label">Total Users</span>
              <span className="overview-change positive">+12% this month</span>
            </div>
            <div className="overview-item">
              <span className="overview-number">45</span>
              <span className="overview-label">Active Packages</span>
              <span className="overview-change positive">+3 new</span>
            </div>
            <div className="overview-item">
              <span className="overview-number">₦2.4M</span>
              <span className="overview-label">Monthly Revenue</span>
              <span className="overview-change positive">+18%</span>
            </div>
          </div>
        </div>

        {/* Admin Tools */}
        <div className="dashboard-card tools-card">
          <h3>🛠️ Admin Tools</h3>
          <div className="admin-tools">
            <Link to="/admin/users" className="admin-tool">
              <span className="tool-icon">👥</span>
              <span className="tool-text">User Management</span>
              <span className="tool-badge">1,247</span>
            </Link>
            <Link to="/admin/packages" className="admin-tool">
              <span className="tool-icon">📦</span>
              <span className="tool-text">Package Management</span>
              <span className="tool-badge">45</span>
            </Link>
            <Link to="/admin/bookings" className="admin-tool">
              <span className="tool-icon">📅</span>
              <span className="tool-text">Booking Management</span>
              <span className="tool-badge">156</span>
            </Link>
            <Link to="/admin/visa" className="admin-tool">
              <span className="tool-icon">🛂</span>
              <span className="tool-text">Visa Management</span>
              <span className="tool-badge">23</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card activity-card">
          <h3>📊 Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-content">
                <p>New user registered: Fatima Usman (Kaduna)</p>
                <small>2 minutes ago</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📦</span>
              <div className="activity-content">
                <p>Package updated: Kano Heritage Explorer</p>
                <small>15 minutes ago</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🛂</span>
              <div className="activity-content">
                <p>Visa request approved for Aisha Mohammed (Lagos)</p>
                <small>1 hour ago</small>
              </div>
            </div>
          </div>
          <Link to="/admin/activity" className="btn btn-outline">
            View All Activity
          </Link>
        </div>

        {/* System Health */}
        <div className="dashboard-card health-card">
          <h3>💚 System Health</h3>
          <div className="health-metrics">
            <div className="health-item">
              <span className="health-label">Server Status</span>
              <span className="health-status online">Online</span>
            </div>
            <div className="health-item">
              <span className="health-label">Database</span>
              <span className="health-status online">Healthy</span>
            </div>
            <div className="health-item">
              <span className="health-label">API Response</span>
              <span className="health-status online">Fast (120ms)</span>
            </div>
            <div className="health-item">
              <span className="health-label">Storage Usage</span>
              <span className="health-status warning">78% Used</span>
            </div>
          </div>
          <Link to="/admin/system" className="btn btn-outline">
            System Settings
          </Link>
        </div>

        {/* Financial Overview */}
        <div className="dashboard-card financial-card">
          <h3>💰 Financial Overview</h3>
          <div className="financial-stats">
            <div className="financial-item">
              <span className="financial-label">Today's Revenue</span>
              <span className="financial-value">₦125,000</span>
            </div>
            <div className="financial-item">
              <span className="financial-label">This Week</span>
              <span className="financial-value">₦890,000</span>
            </div>
            <div className="financial-item">
              <span className="financial-label">This Month</span>
              <span className="financial-value">₦2,400,000</span>
            </div>
          </div>
          <Link to="/admin/reports" className="btn btn-primary">
            View Reports
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-card quick-stats-card">
          <h3>⚡ Quick Stats</h3>
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="stat-icon">📈</span>
              <div className="stat-content">
                <span className="stat-number">156</span>
                <span className="stat-label">Bookings Today</span>
              </div>
            </div>
            <div className="quick-stat">
              <span className="stat-icon">🛂</span>
              <div className="stat-content">
                <span className="stat-number">23</span>
                <span className="stat-label">Visa Requests</span>
              </div>
            </div>
            <div className="quick-stat">
              <span className="stat-icon">⭐</span>
              <div className="stat-content">
                <span className="stat-number">4.9</span>
                <span className="stat-label">Avg Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
