import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiService, Package } from "../../services/api";
import BookingForm from "./components/BookingForm";
import ReviewSystem from "./components/ReviewSystem";
import { useAuth } from "../../context/AuthContext";

/* ─── shared style tokens ─────────────────────────────────────────────────── */
const card: React.CSSProperties = {
  background: "var(--card-bg, #ffffff)",
  border: "2px solid var(--border-light, #e9ecef)",
  borderRadius: "12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
  padding: "2rem",
};

const sectionHeading: React.CSSProperties = {
  color: "var(--primary-blue, #3F84B1)",
  fontSize: "1.25rem",
  fontWeight: 700,
  marginBottom: "1rem",
};

const bodyText: React.CSSProperties = {
  color: "var(--text-primary, #212529)",
  lineHeight: 1.8,
};

const mutedText: React.CSSProperties = {
  color: "var(--text-secondary, #495057)",
  fontSize: "0.9rem",
};

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [package_, setPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiService
      .getPackage(parseInt(id))
      .then(setPackage)
      .catch((err) => {
        console.error("Failed to load package:", err);
        setError("Package not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="section">
        <div className="container text-center">
          <div className="loading" />
          <p style={bodyText}>Loading package details…</p>
        </div>
      </section>
    );
  }

  if (error || !package_) {
    return (
      <section className="section">
        <div className="container text-center">
          <h2 style={bodyText}>Package Not Found</h2>
          <p style={mutedText}>The package you're looking for doesn't exist.</p>
          <Link to="/packages" className="btn btn-primary">
            Browse All Packages
          </Link>
        </div>
      </section>
    );
  }

  const pkg = package_ as any; // gives access to extra backend fields

  return (
    <section className="section">
      <div className="container">
        {/* ── Hero image ─────────────────────────────────────────────────── */}
        {pkg.image ? (
          <img
            src={pkg.image}
            alt={package_.name}
            style={{
              width: "100%",
              height: "clamp(200px, 40vw, 400px)",
              objectFit: "cover",
              borderRadius: "12px",
              marginBottom: "2rem",
              display: "block",
            }}
            onError={(e) =>
              ((e.target as HTMLImageElement).style.display = "none")
            }
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "280px",
              borderRadius: "12px",
              marginBottom: "2rem",
              background: "linear-gradient(135deg, #1a5276 0%, #3F84B1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "5rem",
            }}
          >
            🌍
          </div>
        )}

        {/* ── Main grid: details + booking card ──────────────────────────── */}
        <div
          className="package-details-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
            gap: "2.5rem",
            marginBottom: "3rem",
            alignItems: "start",
          }}
        >
          {/* Left column */}
          <div>
            {/* Title + meta */}
            <h1
              style={{
                color: "var(--primary-blue, #3F84B1)",
                marginBottom: "0.75rem",
                fontSize: "2rem",
              }}
            >
              {package_.name}
            </h1>
            <p
              style={{
                ...mutedText,
                fontSize: "1.1rem",
                marginBottom: "0.75rem",
              }}
            >
              📍 {pkg.destination || package_.location}
            </p>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginBottom: "1.5rem",
              }}
            >
              <span
                style={{
                  background: "var(--primary-blue, #3F84B1)",
                  color: "#ffffff",
                  padding: "0.35rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {package_.type?.replace(/_/g, " ")}
              </span>
              {pkg.duration && (
                <span
                  style={{
                    background: "var(--bg-secondary, #f8f9fa)",
                    color: "var(--text-primary, #212529)",
                    border: "1px solid var(--border-light, #e9ecef)",
                    padding: "0.35rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  ⏱ {pkg.duration} day{pkg.duration !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Description */}
            <div style={{ ...card, marginBottom: "1.5rem" }}>
              <h3 style={sectionHeading}>📖 Package Details</h3>
              <p style={bodyText}>
                {package_.details ||
                  pkg.description ||
                  "No description available."}
              </p>
            </div>

            {/* Inclusions */}
            {(package_.features || pkg.inclusions) && (
              <div style={{ ...card, marginBottom: "1.5rem" }}>
                <h3 style={sectionHeading}>✅ What's Included</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {(package_.features || pkg.inclusions)
                    .split(",")
                    .map((f: string, i: number) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "var(--text-primary, #212529)",
                          padding: "0.4rem 0",
                          borderBottom:
                            "1px solid var(--border-light, #e9ecef)",
                        }}
                      >
                        <span style={{ color: "#22c55e", fontWeight: 700 }}>
                          ✓
                        </span>
                        {f.trim()}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {pkg.requirements && (
              <div style={{ ...card, marginBottom: "1.5rem" }}>
                <h3 style={sectionHeading}>📋 Requirements</h3>
                <p style={bodyText}>{pkg.requirements}</p>
              </div>
            )}

            {/* Itinerary */}
            {pkg.itinerary && (
              <div style={{ ...card, marginBottom: "1.5rem" }}>
                <h3 style={sectionHeading}>🗺 Itinerary</h3>
                <p style={{ ...bodyText, whiteSpace: "pre-line" }}>
                  {pkg.itinerary}
                </p>
              </div>
            )}
          </div>

          {/* Right column — booking card */}
          <div
            className="booking-card-sticky"
            style={{
              ...card,
              position: "sticky",
              top: "2rem",
            }}
          >
            {/* Price */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "1.5rem",
                paddingBottom: "1.5rem",
                borderBottom: "2px solid var(--border-light, #e9ecef)",
              }}
            >
              <div
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  color: "var(--primary-green, #34ad00)",
                  lineHeight: 1.2,
                }}
              >
                {package_.price.formatted}
              </div>
              <p style={{ ...mutedText, marginTop: "0.25rem" }}>per person</p>
            </div>

            {/* Quick info */}
            {pkg.duration && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid var(--border-light, #e9ecef)",
                  marginBottom: "1.5rem",
                }}
              >
                <span style={mutedText}>Duration</span>
                <span
                  style={{
                    color: "var(--text-primary, #212529)",
                    fontWeight: 600,
                  }}
                >
                  {pkg.duration} day{pkg.duration !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* CTA */}
            <button
              className="btn btn-primary"
              style={{
                width: "100%",
                fontSize: "1.1rem",
                padding: "0.85rem",
                marginBottom: "0.75rem",
                fontWeight: 700,
              }}
              onClick={() => setShowBookingForm(true)}
            >
              🎫 Book Now
            </button>
            <Link
              to="/packages"
              className="btn btn-secondary"
              style={{ width: "100%", textAlign: "center", display: "block" }}
            >
              ← Back to Packages
            </Link>

            <p style={{ ...mutedText, textAlign: "center", marginTop: "1rem" }}>
              💳 Secure payment &nbsp;•&nbsp; 🔄 Free cancellation
            </p>
          </div>
        </div>

        {/* ── Important Information ───────────────────────────────────────── */}
        <div style={{ ...card, marginBottom: "2rem" }}>
          <h3 style={sectionHeading}>ℹ️ Important Information</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                icon: "📋",
                title: "Requirements",
                lines: [
                  "Valid ID required",
                  "Comfortable walking shoes",
                  "Camera recommended",
                ],
              },
              {
                icon: "🕒",
                title: "Duration",
                lines: [
                  "Full day tour (8–10 hours)",
                  "Flexible start times available",
                ],
              },
              {
                icon: "🚌",
                title: "Transportation",
                lines: [
                  "Air-conditioned vehicle",
                  "Professional driver / guide",
                ],
              },
            ].map(({ icon, title, lines }) => (
              <div
                key={title}
                style={{
                  background: "var(--bg-secondary, #f8f9fa)",
                  border: "1px solid var(--border-light, #e9ecef)",
                  borderRadius: "10px",
                  padding: "1.25rem",
                }}
              >
                <h4
                  style={{
                    color: "var(--text-primary, #212529)",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                    fontSize: "1rem",
                  }}
                >
                  {icon} {title}
                </h4>
                {lines.map((line) => (
                  <p
                    key={line}
                    style={{ ...mutedText, marginBottom: "0.35rem" }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Reviews ────────────────────────────────────────────────────── */}
        <div style={{ marginTop: "3rem" }}>
          <ReviewSystem
            packageId={package_.id}
            showForm={!!user}
            showReviews={true}
          />
        </div>

        {/* ── Booking Form Modal ──────────────────────────────────────────── */}
        {showBookingForm && (
          <div
            className="modal-overlay"
            onClick={() => setShowBookingForm(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Book {package_.name}</h3>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="modal-close"
                >
                  ✕
                </button>
              </div>
              <BookingForm
                packageId={package_.id}
                packageTitle={package_.name}
                packagePrice={package_.price.ngn}
                onSuccess={() => setShowBookingForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PackageDetails;
