import React from "react";
import { useLocation, useParams } from "react-router-dom";
import PaymentForm from "./components/PaymentForm";

const Payment: React.FC = () => {
  const location = useLocation();
  const { bookingId } = useParams();

  // Get payment details from location state or default values
  const amount = location.state?.amount || 50000;
  const bookingData = location.state?.bookingData;

  return (
    <section className="section">
      <div className="container">
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {bookingData && (
            <div
              style={{
                background: "var(--card-bg)",
                padding: "1.5rem",
                borderRadius: "8px",
                marginBottom: "2rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{ marginBottom: "1rem", color: "var(--primary-blue)" }}
              >
                📋 Booking Summary
              </h3>
              <div className="booking-summary-row">
                <span>Package:</span>
                <span>{bookingData.packageTitle || "Travel Package"}</span>
              </div>
              <div className="booking-summary-row">
                <span>Travel Date:</span>
                <span>
                  {new Date(bookingData.travelDate).toLocaleDateString()}
                </span>
              </div>
              <div className="booking-summary-row">
                <span>Participants:</span>
                <span>{bookingData.participants} people</span>
              </div>
              <div className="booking-summary-row total">
                <span>
                  <strong>Total Amount:</strong>
                </span>
                <span>
                  <strong>₦{amount.toLocaleString()}</strong>
                </span>
              </div>
            </div>
          )}

          <div
            style={{
              background: "var(--card-bg)",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <PaymentForm amount={amount} bookingId={bookingId} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
