import React from "react";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "booking" | "payment" | "visa" | "user";
  size?: "small" | "medium" | "large";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "default",
  size = "medium",
}) => {
  const getStatusConfig = () => {
    const configs = {
      // Booking statuses
      pending: { color: "#f59e0b", icon: "⏳", label: "Pending" },
      confirmed: { color: "#10b981", icon: "✅", label: "Confirmed" },
      cancelled: { color: "#ef4444", icon: "❌", label: "Cancelled" },
      completed: { color: "#6366f1", icon: "🎉", label: "Completed" },

      // Payment statuses
      paid: { color: "#10b981", icon: "💳", label: "Paid" },
      refunded: { color: "#f59e0b", icon: "💰", label: "Refunded" },
      failed: { color: "#ef4444", icon: "❌", label: "Failed" },

      // User statuses
      active: { color: "#10b981", icon: "✅", label: "Active" },
      inactive: { color: "#6b7280", icon: "⏸️", label: "Inactive" },
      suspended: { color: "#ef4444", icon: "🚫", label: "Suspended" },

      // Visa statuses
      submitted: { color: "#3b82f6", icon: "📝", label: "Submitted" },
      under_review: { color: "#f59e0b", icon: "🔍", label: "Under Review" },
      approved: { color: "#10b981", icon: "✅", label: "Approved" },
      rejected: { color: "#ef4444", icon: "❌", label: "Rejected" },

      // Package statuses
      draft: { color: "#6b7280", icon: "📝", label: "Draft" },

      // Review statuses
      approved_review: { color: "#10b981", icon: "✅", label: "Approved" },
      rejected_review: { color: "#ef4444", icon: "❌", label: "Rejected" },
      pending_review: { color: "#f59e0b", icon: "⏳", label: "Pending" },
    };

    return (
      configs[status as keyof typeof configs] || {
        color: "#6b7280",
        icon: "❓",
        label: status,
      }
    );
  };

  const config = getStatusConfig();

  return (
    <span
      className={`status-badge status-badge-${size}`}
      style={{
        backgroundColor: config.color,
      }}
    >
      <span className="status-icon">{config.icon}</span>
      <span className="status-text">{config.label}</span>
    </span>
  );
};

export default StatusBadge;
