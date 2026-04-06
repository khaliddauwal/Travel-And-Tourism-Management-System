import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import LoadingSpinner from "./LoadingSpinner";

interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: "booking" | "visa" | "payment" | "system" | "promotion";
  status: "unread" | "read";
  actionUrl?: string;
  createdAt: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  // Mock notifications data - defined outside useCallback to avoid dependency issues
  const mockNotifications: Notification[] = React.useMemo(
    () => [
      {
        id: 1,
        userId: 1,
        title: "Booking Confirmed",
        message:
          "Your booking for Lagos City Explorer has been confirmed. Reference: TMS-ABC123",
        type: "booking",
        status: "unread",
        actionUrl: "/dashboard",
        createdAt: "2024-01-20T10:30:00Z",
      },
      {
        id: 2,
        userId: 1,
        title: "Payment Successful",
        message:
          "Payment of ₦50,000 has been processed successfully for your booking.",
        type: "payment",
        status: "unread",
        actionUrl: "/payment-history",
        createdAt: "2024-01-20T09:15:00Z",
      },
      {
        id: 3,
        userId: 1,
        title: "Visa Application Update",
        message:
          "Your visa application for United States has been approved. Please check your email for details.",
        type: "visa",
        status: "read",
        actionUrl: "/visa-status",
        createdAt: "2024-01-19T14:20:00Z",
      },
      {
        id: 4,
        userId: 1,
        title: "Special Offer: 20% Off",
        message:
          "Limited time offer! Get 20% off on all Northern Nigeria packages. Use code NORTH20.",
        type: "promotion",
        status: "read",
        actionUrl: "/packages",
        createdAt: "2024-01-18T11:45:00Z",
      },
      {
        id: 5,
        userId: 1,
        title: "System Maintenance",
        message:
          "Scheduled maintenance on Jan 25, 2024 from 2:00 AM to 4:00 AM. Services may be temporarily unavailable.",
        type: "system",
        status: "read",
        createdAt: "2024-01-17T16:30:00Z",
      },
    ],
    [],
  );

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let filteredNotifications = mockNotifications;
      if (filter !== "all") {
        if (filter === "unread") {
          filteredNotifications = mockNotifications.filter(
            (n) => n.status === "unread",
          );
        } else {
          filteredNotifications = mockNotifications.filter(
            (n) => n.type === filter,
          );
        }
      }

      setNotifications(filteredNotifications);
    } catch (error) {
      showToast("Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  }, [filter, showToast, mockNotifications]);

  useEffect(() => {
    if (isOpen && user) {
      loadNotifications();
    }
  }, [isOpen, user, loadNotifications]);

  const markAsRead = async (notificationId: number) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, status: "read" as const }
            : notification,
        ),
      );
    } catch (error) {
      showToast("Failed to mark notification as read", "error");
    }
  };

  const markAllAsRead = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          status: "read" as const,
        })),
      );

      showToast("All notifications marked as read", "success");
    } catch (error) {
      showToast("Failed to mark all notifications as read", "error");
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId),
      );

      showToast("Notification deleted", "success");
    } catch (error) {
      showToast("Failed to delete notification", "error");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return "📅";
      case "visa":
        return "🛂";
      case "payment":
        return "💳";
      case "system":
        return "⚙️";
      case "promotion":
        return "🎉";
      default:
        return "📢";
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "booking":
        return "var(--primary-blue)";
      case "visa":
        return "var(--warning-color)";
      case "payment":
        return "var(--success-color)";
      case "system":
        return "var(--info-color)";
      case "promotion":
        return "var(--primary-green)";
      default:
        return "var(--text-gray)";
    }
  };

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  if (!isOpen) return null;

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-center" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <h3>🔔 Notifications</h3>
          <div className="notification-actions">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-sm btn-outline"
              >
                Mark All Read
              </button>
            )}
            <button onClick={onClose} className="btn btn-sm btn-outline">
              ✕
            </button>
          </div>
        </div>

        <div className="notification-filters">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="booking">Bookings</option>
            <option value="visa">Visa</option>
            <option value="payment">Payments</option>
            <option value="promotion">Promotions</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="notification-content">
          {loading ? (
            <div className="notification-loading">
              <LoadingSpinner />
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.status === "unread" ? "unread" : ""}`}
                >
                  <div className="notification-icon">
                    <span
                      style={{
                        color: getNotificationTypeColor(notification.type),
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>

                  <div className="notification-body">
                    <div className="notification-title">
                      {notification.title}
                      {notification.status === "unread" && (
                        <span className="unread-badge">●</span>
                      )}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {new Date(notification.createdAt).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(notification.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                      <span className="notification-type">
                        {notification.type.charAt(0).toUpperCase() +
                          notification.type.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="notification-actions">
                    {notification.status === "unread" && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="btn btn-xs btn-outline"
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="btn btn-xs btn-primary"
                        onClick={() => {
                          if (notification.status === "unread") {
                            markAsRead(notification.id);
                          }
                          onClose();
                        }}
                      >
                        View
                      </a>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="btn btn-xs btn-danger"
                      title="Delete notification"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-notifications">
              <div className="no-notifications-icon">🔔</div>
              <h4>No notifications</h4>
              <p>You're all caught up! New notifications will appear here.</p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="notification-footer">
            <p>
              Showing {notifications.length} notification
              {notifications.length !== 1 ? "s" : ""}
              {unreadCount > 0 && <span> • {unreadCount} unread</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
