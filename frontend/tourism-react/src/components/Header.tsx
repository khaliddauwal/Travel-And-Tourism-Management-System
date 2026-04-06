import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ROLE_LABELS, ROLE_COLORS, ROLE_ICONS } from "../types/roles";
import NotificationCenter from "./NotificationCenter";

interface NavigationItem {
  path: string;
  label: string;
  show: boolean;
  highlight?: boolean;
}

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getNavigationItems = (): NavigationItem[] => {
    const items: NavigationItem[] = [];

    // Visitors only - show Home link to marketing page
    if (!user) {
      items.push({ path: "/", label: "Home", show: true });
    }

    // Role-specific navigation for logged-in users
    if (user) {
      if (user.role === "admin") {
        // Admin navigation
        items.push({
          path: "/admin/dashboard",
          label: "Dashboard",
          show: true,
        });
        items.push({
          path: "/admin/users",
          label: "User Management",
          show: true,
        });
        items.push({
          path: "/admin/packages",
          label: "Package Management",
          show: true,
        });
        items.push({
          path: "/admin/bookings",
          label: "Booking Management",
          show: true,
        });
        items.push({
          path: "/admin/visa",
          label: "Visa Management",
          show: true,
        });
      } else if (user.role === "tourist") {
        // Tourist navigation
        items.push({
          path: "/tourist/dashboard",
          label: "Dashboard",
          show: true,
        });
        items.push({
          path: "/tourist/bookings",
          label: "My Bookings",
          show: true,
        });
        items.push({
          path: "/packages",
          label: "Packages",
          show: true,
        });
        items.push({
          path: "/visa-request",
          label: "Visa Assistance",
          show: true,
        });
        items.push({
          path: "/ai-recommendations",
          label: "AI Assistant",
          show: true,
        });
      }
    } else {
      // Visitor navigation
      items.push({
        path: "/packages",
        label: "Packages",
        show: true,
      });
      items.push({
        path: "/about",
        label: "About",
        show: true,
      });
      items.push({
        path: "/contact",
        label: "Contact",
        show: true,
      });
    }

    return items.filter((item) => item.show);
  };

  const getUserMenuItems = () => {
    if (!user) return [];

    const items = [];

    // Common user actions in dropdown
    if (user.role === "tourist") {
      items.push({
        path: "/visa-status",
        label: "Visa Status",
        show: true,
      });
      items.push({
        path: "/payment",
        label: "Payment History",
        show: true,
      });
    }

    if (user.role === "admin") {
      items.push({
        path: "/admin/settings",
        label: "Settings",
        show: true,
      });
      items.push({
        path: "/admin/reports",
        label: "Reports",
        show: true,
      });
    }

    return items.filter((item) => item.show);
  };

  const navigationItems = getNavigationItems();
  const userMenuItems = getUserMenuItems();

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.875rem",
            }}
          >
            <div className="top-header-left">
              <span>📞 Support: +1-800-TRAVEL</span>
            </div>
            <div className="top-header-right">
              <span>
                ✉️ support@travelmanagement.com | 🌍 Travel & Tourism Management
                System
              </span>
              {user && (
                <span
                  className="user-role-indicator"
                  style={{ marginLeft: "1rem" }}
                >
                  {ROLE_ICONS[user.role]} {ROLE_LABELS[user.role]}
                </span>
              )}
              <button
                onClick={toggleTheme}
                className="theme-toggle-header"
                aria-label="Toggle theme"
                style={{ marginLeft: "1rem" }}
              >
                {theme === "light" ? "Light Mode 🌙" : "Dark Mode ☀️"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Link
                to={
                  user
                    ? user.role === "admin"
                      ? "/admin/dashboard"
                      : "/tourist/dashboard"
                    : "/"
                }
                onClick={closeMobileMenu}
              >
                Travel and Tourism <br />
                <span>Management System</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Navigation */}
            <nav className={`nav ${isMobileMenuOpen ? "nav-open" : ""}`}>
              <ul className="nav-menu">
                {navigationItems.map((item) => (
                  <li
                    key={item.path}
                    className={item.highlight ? "nav-highlight" : ""}
                  >
                    <Link to={item.path} onClick={closeMobileMenu}>
                      {item.label}
                    </Link>
                  </li>
                ))}

                {user ? (
                  <>
                    {/* User Role Badge */}
                    <li className="user-info-mobile">
                      <div
                        className="role-badge"
                        style={{
                          backgroundColor: ROLE_COLORS[user.role],
                        }}
                      >
                        {ROLE_ICONS[user.role]} {ROLE_LABELS[user.role]}
                      </div>
                    </li>

                    {/* User Menu Items */}
                    {userMenuItems.map((item) => (
                      <li key={item.path}>
                        <Link to={item.path} onClick={closeMobileMenu}>
                          {item.label}
                        </Link>
                      </li>
                    ))}

                    {/* User Profile Dropdown for Desktop */}
                    <li className="user-dropdown">
                      <div className="dropdown">
                        {/* Notification Button */}
                        <button
                          className="notification-btn"
                          onClick={() => setShowNotifications(true)}
                          title="Notifications"
                        >
                          🔔
                          <span className="notification-badge">3</span>
                        </button>

                        <button className="dropdown-toggle">
                          <span className="user-name">{user.fullName}</span>
                          <div
                            className="role-badge-small"
                            style={{
                              backgroundColor: ROLE_COLORS[user.role],
                            }}
                          >
                            {ROLE_ICONS[user.role]}
                          </div>
                        </button>
                        <div className="dropdown-menu">
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="dropdown-item"
                              onClick={closeMobileMenu}
                            >
                              {item.label}
                            </Link>
                          ))}
                          <div className="dropdown-divider"></div>
                          <button
                            onClick={handleLogout}
                            className="dropdown-item logout-btn"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </li>

                    {/* Mobile Logout */}
                    <li className="mobile-only">
                      <button
                        onClick={handleLogout}
                        className="btn btn-secondary"
                      >
                        Logout
                      </button>
                    </li>

                    {/* Mobile Theme Toggle */}
                    <li className="mobile-only">
                      <button
                        onClick={toggleTheme}
                        className="btn btn-outline theme-toggle-mobile"
                        aria-label="Toggle theme"
                      >
                        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="btn btn-primary"
                        onClick={closeMobileMenu}
                      >
                        Login
                      </Link>
                    </li>

                    {/* Mobile Theme Toggle for non-logged users */}
                    <li className="mobile-only">
                      <button
                        onClick={toggleTheme}
                        className="btn btn-outline theme-toggle-mobile"
                        aria-label="Toggle theme"
                      >
                        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

export default Header;
