import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SidebarItem {
  key: string;
  label: string;
  icon: string;
  path: string;
  permission?: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { hasPermission, getUserRole } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const role = getUserRole();

  const sidebarItems: SidebarItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: "📊",
      path: "/dashboard",
    },
    // Tourist items
    ...(role === "tourist"
      ? [
          {
            key: "my-bookings",
            label: "My Bookings",
            icon: "📅",
            path: "/tourist/bookings",
          },
          {
            key: "visa-requests",
            label: "Visa Requests",
            icon: "🛂",
            path: "/visa-status",
          },
        ]
      : []),
    // Admin items
    ...(hasPermission("canAccessAdminPanel")
      ? [
          {
            key: "admin-section",
            label: "Administration",
            icon: "👑",
            path: "",
            children: [
              {
                key: "user-management",
                label: "User Management",
                icon: "👥",
                path: "/admin/users",
              },
              {
                key: "package-management",
                label: "Package Management",
                icon: "📦",
                path: "/admin/packages",
              },
              {
                key: "booking-management",
                label: "Booking Management",
                icon: "📅",
                path: "/admin/bookings",
              },
              {
                key: "visa-admin",
                label: "Visa Administration",
                icon: "🛂",
                path: "/admin/visa",
              },
              {
                key: "reviews",
                label: "Reviews & Ratings",
                icon: "⭐",
                path: "/admin/reviews",
              },
              {
                key: "reports",
                label: "Reports & Analytics",
                icon: "📈",
                path: "/admin/reports",
              },
              {
                key: "settings",
                label: "System Settings",
                icon: "⚙️",
                path: "/admin/settings",
              },
            ],
          },
        ]
      : []),
  ];

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.key);
    const active = item.path && isActive(item.path);

    if (hasChildren) {
      return (
        <div key={item.key} className="sidebar-group">
          <button
            className={`sidebar-item sidebar-group-header ${isExpanded ? "expanded" : ""}`}
            onClick={() => toggleExpanded(item.key)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            <span className="sidebar-arrow">{isExpanded ? "▼" : "▶"}</span>
          </button>
          {isExpanded && item.children && (
            <div className="sidebar-children">
              {item.children.map((child) =>
                renderSidebarItem(child, level + 1),
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.key}
        to={item.path}
        className={`sidebar-item ${active ? "active" : ""}`}
        onClick={onClose}
        style={{ paddingLeft: `${1 + level * 0.5}rem` }}
      >
        <span className="sidebar-icon">{item.icon}</span>
        <span className="sidebar-label">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <h3>Management</h3>
          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => renderSidebarItem(item))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
