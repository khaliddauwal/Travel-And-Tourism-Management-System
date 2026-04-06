import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

interface DashboardStats {
  totalUsers: number;
  activePackages: number;
  totalBookings: number;
  monthlyRevenue: number;
  pendingBookings: number;
  visaRequests: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activePackages: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    pendingBookings: 0,
    visaRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Load statistics from API
      const [usersResponse, packagesResponse, bookingsStats] =
        await Promise.all([
          apiService.getUsers({ limit: 1 }),
          apiService.getPackages({ limit: 1, status: "published" }),
          apiService.getBookingStatistics(),
        ]);

      setStats({
        totalUsers:
          usersResponse.pagination?.total ?? usersResponse.data?.length ?? 0,
        activePackages:
          packagesResponse.pagination?.total ??
          packagesResponse.packages?.length ??
          0,
        totalBookings: bookingsStats?.status_counts?.confirmed || 0,
        monthlyRevenue: bookingsStats?.total_revenue || 0,
        pendingBookings: bookingsStats?.status_counts?.pending || 0,
        visaRequests: 0,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <LoadingSpinner text="Loading dashboard..." />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="role-dashboard admin-dashboard">
          <div className="dashboard-header">
            <h2>👑 Admin Dashboard</h2>
            <p>
              Welcome back, {user?.fullName}! System overview and management.
            </p>
          </div>

          <div className="dashboard-grid">
            {/* System Overview */}
            <div className="dashboard-card overview-card">
              <h3>🏢 System Overview</h3>
              <div className="overview-stats">
                <div className="overview-item">
                  <span className="overview-number">
                    {stats.totalUsers.toLocaleString()}
                  </span>
                  <span className="overview-label">Total Users</span>
                </div>
                <div className="overview-item">
                  <span className="overview-number">
                    {stats.activePackages}
                  </span>
                  <span className="overview-label">Active Packages</span>
                </div>
                <div className="overview-item">
                  <span className="overview-number">
                    ₦{(stats.monthlyRevenue / 1000000).toFixed(1)}M
                  </span>
                  <span className="overview-label">Total Revenue</span>
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
                  <span className="tool-badge">{stats.totalUsers}</span>
                </Link>
                <Link to="/admin/packages" className="admin-tool">
                  <span className="tool-icon">📦</span>
                  <span className="tool-text">Package Management</span>
                  <span className="tool-badge">{stats.activePackages}</span>
                </Link>
                <Link to="/admin/bookings" className="admin-tool">
                  <span className="tool-icon">📅</span>
                  <span className="tool-text">Booking Management</span>
                  <span className="tool-badge">{stats.totalBookings}</span>
                </Link>
                <Link to="/admin/visa" className="admin-tool">
                  <span className="tool-icon">🛂</span>
                  <span className="tool-text">Visa Management</span>
                  <span className="tool-badge">{stats.visaRequests}</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dashboard-card activity-card">
              <h3>📊 Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">👤</span>
                  <div className="activity-info">
                    <p>System statistics loaded</p>
                    <small>Real-time data</small>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📅</span>
                  <div className="activity-info">
                    <p>{stats.pendingBookings} pending bookings</p>
                    <small>Requires attention</small>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📦</span>
                  <div className="activity-info">
                    <p>{stats.activePackages} active packages</p>
                    <small>Available for booking</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-card stats-card">
              <h3>📈 Quick Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{stats.pendingBookings}</span>
                  <span className="stat-label">Pending Bookings</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.visaRequests}</span>
                  <span className="stat-label">Visa Requests</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.totalUsers}</span>
                  <span className="stat-label">Total Users</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    ₦{(stats.monthlyRevenue / 1000).toLocaleString()}K
                  </span>
                  <span className="stat-label">Total Revenue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
