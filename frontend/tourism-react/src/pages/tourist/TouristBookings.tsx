import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../components/Toast";
import { apiService } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDateToDisplay } from "../../utils/dateUtils";

interface Booking {
  id: number;
  packageTitle: string;
  travelDate: string;
  participants: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  bookingDate: string;
  bookingReference?: string;
}

const TouristBookings: React.FC = () => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getBookings({ limit: 50 });
      setBookings(response.data as Booking[]);
    } catch (error: any) {
      console.error("Failed to load bookings:", error);
      showToast(error.message || "Failed to load bookings", "error");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancel = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      setCancelling(bookingId);
      await apiService.cancelBooking(bookingId, "Cancelled by user");
      showToast("Booking cancelled successfully", "success");
      await loadBookings();
    } catch (error: any) {
      showToast(error.message || "Failed to cancel booking", "error");
    } finally {
      setCancelling(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: "⏳ Pending",
      confirmed: "✅ Confirmed",
      cancelled: "❌ Cancelled",
      completed: "🎉 Completed",
    };
    return badges[status] || status;
  };

  const filteredBookings = bookings.filter(
    (b) => filter === "all" || b.status === filter,
  );

  return (
    <section className="section">
      <div className="container">
        <div className="page-header">
          <h1>📅 My Bookings</h1>
          <p>View and manage your travel bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {["all", "pending", "confirmed", "completed"].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "all"
                ? ` (${bookings.length})`
                : ` (${bookings.filter((b) => b.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your bookings..." />
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No bookings found</h3>
            <p>
              {filter === "all"
                ? "You haven't made any bookings yet."
                : `No ${filter} bookings.`}
            </p>
            <Link to="/packages" className="btn btn-primary">
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="bookings-grid">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.packageTitle || `Booking #${booking.id}`}</h3>
                  <span className={`status-badge status-${booking.status}`}>
                    {getStatusBadge(booking.status)}
                  </span>
                </div>
                <div className="booking-details">
                  {booking.bookingReference && (
                    <div className="detail-row">
                      <span className="detail-label">🔖 Reference:</span>
                      <span className="detail-value">
                        {booking.bookingReference}
                      </span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">📅 Travel Date:</span>
                    <span className="detail-value">
                      {formatDateToDisplay(booking.travelDate)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">👥 Participants:</span>
                    <span className="detail-value">{booking.participants}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💰 Total Amount:</span>
                    <span className="detail-value">
                      ₦{Number(booking.totalAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📆 Booked On:</span>
                    <span className="detail-value">
                      {formatDateToDisplay(booking.bookingDate)}
                    </span>
                  </div>
                </div>
                <div className="booking-actions">
                  <Link
                    to={`/tourist/booking/${booking.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    View Details
                  </Link>
                  {booking.status === "pending" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelling === booking.id}
                    >
                      {cancelling === booking.id ? "Cancelling…" : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TouristBookings;
