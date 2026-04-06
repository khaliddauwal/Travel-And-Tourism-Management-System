import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface BookingData {
  packageId: number;
  userId: string;
  travelDate: string;
  participants: number;
  totalAmount: number;
  specialRequests: string;
  emergencyContact: string;
  emergencyPhone: string;
  status: string;
  paymentStatus: string;
  reference: string;
}

const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    // Get booking data from location state or fetch from API
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
    } else {
      // In a real app, fetch booking data by ID
      setBookingData({
        packageId: 1,
        userId: user?.email || "",
        travelDate: "2024-03-15",
        participants: 2,
        totalAmount: 100000,
        specialRequests: "",
        emergencyContact: "John Doe",
        emergencyPhone: "+234-800-123-4567",
        status: "pending",
        paymentStatus: "pending",
        reference: `TMS-${bookingId}`,
      });
    }
  }, [bookingId, location.state, user]);

  if (!bookingData) {
    return (
      <section className="section">
        <div className="container">
          <div className="text-center">
            <div className="loading"></div>
            <p>Loading booking details...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "var(--card-bg)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          {/* Success Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
            <h1
              style={{ color: "var(--success-color)", marginBottom: "0.5rem" }}
            >
              Booking Submitted Successfully!
            </h1>
            <p style={{ color: "var(--text-gray)" }}>
              Your booking request has been received and is being processed.
            </p>
          </div>

          {/* Booking Reference */}
          <div
            style={{
              background: "var(--primary-blue)",
              padding: "1rem",
              borderRadius: "8px",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0" }}>Booking Reference</h3>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                letterSpacing: "2px",
              }}
            >
              {bookingData.reference}
            </div>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.9rem",
                opacity: 0.9,
              }}
            >
              Please save this reference number for your records
            </p>
          </div>

          {/* Booking Details */}
          <div className="booking-details">
            <h3 style={{ marginBottom: "1rem", color: "var(--primary-blue)" }}>
              📋 Booking Details
            </h3>

            <div className="detail-row">
              <span className="detail-label">👤 Customer:</span>
              <span className="detail-value">{user?.fullName}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">📧 Email:</span>
              <span className="detail-value">{user?.email}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">📅 Travel Date:</span>
              <span className="detail-value">
                {new Date(bookingData.travelDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">👥 Participants:</span>
              <span className="detail-value">
                {bookingData.participants} people
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">💰 Total Amount:</span>
              <span
                className="detail-value"
                style={{ fontWeight: "bold", color: "var(--primary-green)" }}
              >
                ₦{bookingData.totalAmount.toLocaleString()}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">📊 Status:</span>
              <span className="status-badge pending">Pending Confirmation</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">💳 Payment Status:</span>
              <span className="status-badge pending">Payment Required</span>
            </div>

            {bookingData.emergencyContact && (
              <>
                <div className="detail-row">
                  <span className="detail-label">🚨 Emergency Contact:</span>
                  <span className="detail-value">
                    {bookingData.emergencyContact}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📞 Emergency Phone:</span>
                  <span className="detail-value">
                    {bookingData.emergencyPhone}
                  </span>
                </div>
              </>
            )}

            {bookingData.specialRequests && (
              <div className="detail-row">
                <span className="detail-label">📝 Special Requests:</span>
                <span className="detail-value">
                  {bookingData.specialRequests}
                </span>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div
            style={{
              background: "var(--info-bg)",
              border: "1px solid var(--info-border)",
              borderRadius: "8px",
              padding: "1.5rem",
              marginTop: "2rem",
            }}
          >
            <h3 style={{ color: "var(--info-color)", marginBottom: "1rem" }}>
              📌 Next Steps
            </h3>
            <ol
              style={{
                margin: 0,
                paddingLeft: "1.5rem",
                color: "var(--text-color)",
              }}
            >
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Payment:</strong> Complete your payment to confirm the
                booking
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Confirmation:</strong> You'll receive an email
                confirmation within 24 hours
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Documentation:</strong> Prepare required travel
                documents
              </li>
              <li>
                <strong>Contact:</strong> Our team will reach out with detailed
                itinerary
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "2rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/payment"
              className="btn btn-primary"
              style={{ flex: "1", minWidth: "200px" }}
            >
              💳 Proceed to Payment
            </Link>
            <Link
              to="/dashboard"
              className="btn btn-outline"
              style={{ flex: "1", minWidth: "200px" }}
            >
              📊 View Dashboard
            </Link>
          </div>

          {/* Contact Info */}
          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              padding: "1rem",
              background: "var(--light-bg)",
              borderRadius: "8px",
            }}
          >
            <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-gray)" }}>
              Need help? Contact our support team:
            </p>
            <p
              style={{
                margin: 0,
                fontWeight: "bold",
                color: "var(--primary-blue)",
              }}
            >
              📧 support@travelmanagement.com | 📞 +1-800-TRAVEL-MGMT
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingConfirmation;
