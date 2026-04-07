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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  const getNavigationItems = (): NavigationItem[] => {
    if (!user) {
      return [
        { path: "/", label: "Home", show: true },
        { path: "/packages", label: "Packages", show: true },
        { path: "/about", label: "About", show: true },
        { path: "/contact", label: "Contact", show: true },
      ];
    }
    if (user.role === "admin") {
      return [
        { path: "/admin/dashboard", label: "Dashboard", show: true },
        { path: "/admin/users", label: "User Management", show: true },
        { path: "/admin/packages", label: "Package Management", show: true },
        { path: "/admin/bookings", label: "Booking Management", show: true },
        { path: "/admin/visa", label: "Visa Management", show: true },
        { path: "/admin/settings", label: "Settings", show: true },
        { path: "/admin/reports", label: "Reports", show: true },
      ];
    }
    // tourist
    return [
      { path: "/tourist/dashboard", label: "Dashboard", show: true },
      { path: "/tourist/bookings", label: "My Bookings", show: true },
      { path: "/packages", label: "Packages", show: true },
      { path: "/visa-request", label: "Visa Assistance", show: true },
      { path: "/visa-status", label: "Visa Status", show: true },
      { path: "/payment", label: "Payment History", show: true },
    ];
  };

  const navItems = getNavigationItems().filter((i) => i.show);

  /* ── inline style tokens ── */
  const drawerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    right: isMobileMenuOpen ? 0 : "-100%",
    width: "min(300px, 88vw)",
    height: "100vh",
    background: "var(--bg-primary, #0f172a)",
    borderLeft: "1px solid var(--border-color, #30363d)",
    boxShadow: "-4px 0 24px rgba(0,0,0,0.4)",
    zIndex: 99999,
    overflowY: "auto",
    transition: "right 0.3s ease",
    display: "flex",
    flexDirection: "column",
    padding: "1rem 0",
  };

  const overlayStyle: React.CSSProperties = {
    display: isMobileMenuOpen ? "block" : "none",
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    zIndex: 99998,
    cursor: "pointer",
  };

  const navLinkStyle: React.CSSProperties = {
    display: "block",
    padding: "0.875rem 1.5rem",
    color: "var(--text-primary, #f1f5f9)",
    textDecoration: "none",
    fontSize: "0.9375rem",
    fontWeight: 600,
    borderBottom: "1px solid var(--border-light, #21262d)",
    cursor: "pointer",
    minHeight: "48px",
    lineHeight: "1.4",
    boxSizing: "border-box",
  };

  const closeBtnStyle: React.CSSProperties = {
    alignSelf: "flex-end",
    margin: "0 1rem 0.5rem",
    background: "var(--bg-tertiary, #334155)",
    border: "1px solid var(--border-color, #30363d)",
    borderRadius: "8px",
    color: "var(--text-primary, #f1f5f9)",
    width: "40px",
    height: "40px",
    fontSize: "1.25rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  return (
    <>
      {/* Top bar — hidden on mobile via CSS */}
      <div className="top-header">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.875rem",
            }}
          >
            <span>📞 Support: +1-800-TRAVEL</span>
            <div
              className="top-header-right"
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <span>✉️ support@travelmanagement.com</span>
              {user && (
                <span style={{ fontWeight: 600 }}>
                  {ROLE_ICONS[user.role]} {ROLE_LABELS[user.role]}
                </span>
              )}
              <button
                onClick={toggleTheme}
                className="theme-toggle-header"
                aria-label="Toggle theme"
              >
                {theme === "light" ? "Light Mode 🌙" : "Dark Mode ☀️"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
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

            {/* Desktop nav */}
            <nav className="nav desktop-nav">
              <ul className="nav-menu">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}

                {user ? (
                  <li className="user-dropdown">
                    <div className="dropdown">
                      <button
                        className="notification-btn"
                        onClick={() => setShowNotifications(true)}
                        title="Notifications"
                      >
                        🔔<span className="notification-badge">3</span>
                      </button>
                      <button className="dropdown-toggle">
                        <span className="user-name">{user.fullName}</span>
                        <div
                          className="role-badge-small"
                          style={{ backgroundColor: ROLE_COLORS[user.role] }}
                        >
                          {ROLE_ICONS[user.role]}
                        </div>
                      </button>
                      <div className="dropdown-menu">
                        <div className="dropdown-divider" />
                        <button
                          onClick={handleLogout}
                          className="dropdown-item logout-btn"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li>
                    <Link to="/login" className="btn btn-primary">
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* Hamburger — mobile only */}
            <button
              className="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span
                style={{
                  display: "block",
                  width: 25,
                  height: 3,
                  background: "var(--text-primary, #f1f5f9)",
                  margin: "4px 0",
                  transition: "0.3s",
                  transform: isMobileMenuOpen
                    ? "rotate(45deg) translate(5px,5px)"
                    : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 25,
                  height: 3,
                  background: "var(--text-primary, #f1f5f9)",
                  margin: "4px 0",
                  transition: "0.3s",
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 25,
                  height: 3,
                  background: "var(--text-primary, #f1f5f9)",
                  margin: "4px 0",
                  transition: "0.3s",
                  transform: isMobileMenuOpen
                    ? "rotate(-45deg) translate(5px,-5px)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer — fully inline styles, no CSS conflicts ── */}
      <div style={overlayStyle} onClick={closeMobileMenu} aria-hidden="true" />

      <div
        style={drawerStyle}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <button
          style={closeBtnStyle}
          onClick={closeMobileMenu}
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* User badge */}
        {user && (
          <div
            style={{
              padding: "0.75rem 1.5rem",
              borderBottom: "1px solid var(--border-light, #21262d)",
            }}
          >
            <div
              className="role-badge"
              style={{
                backgroundColor: ROLE_COLORS[user.role],
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 0.9rem",
                borderRadius: "20px",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              {ROLE_ICONS[user.role]} {ROLE_LABELS[user.role]}
            </div>
            <div
              style={{
                marginTop: "0.4rem",
                fontSize: "0.875rem",
                color: "var(--text-secondary, #cbd5e1)",
              }}
            >
              {user.fullName}
            </div>
          </div>
        )}

        {/* Nav links */}
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={navLinkStyle}
            onClick={closeMobileMenu}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "var(--bg-secondary, #1e293b)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {item.label}
          </Link>
        ))}

        {/* Theme toggle */}
        <button
          onClick={() => {
            toggleTheme();
          }}
          style={{
            ...navLinkStyle,
            background: "none",
            border: "none",
            textAlign: "left",
            width: "100%",
            cursor: "pointer",
          }}
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>

        {/* Logout */}
        {user ? (
          <button
            onClick={handleLogout}
            style={{
              ...navLinkStyle,
              background: "none",
              border: "none",
              textAlign: "left",
              width: "100%",
              cursor: "pointer",
              color: "#ef4444",
              borderBottom: "none",
            }}
          >
            🚪 Logout
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              ...navLinkStyle,
              color: "var(--accent-gold, #d4af37)",
              borderBottom: "none",
            }}
            onClick={closeMobileMenu}
          >
            Login →
          </Link>
        )}
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

export default Header;
