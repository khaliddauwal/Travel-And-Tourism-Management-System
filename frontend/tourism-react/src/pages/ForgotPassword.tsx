import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import LoadingSpinner from "../components/LoadingSpinner";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSent(true);
      showToast("Password reset instructions sent to your email", "success");
    } catch (err) {
      setError("Failed to send reset instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <section className="section">
        <div className="container">
          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto",
              background: "var(--card-bg)",
              padding: "3rem",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
            <h2 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>
              Check Your Email
            </h2>
            <p style={{ marginBottom: "2rem", color: "var(--text-gray)" }}>
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p
              style={{
                marginBottom: "2rem",
                fontSize: "0.9rem",
                color: "var(--text-gray)",
              }}
            >
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button
                onClick={() => setSent(false)}
                className="btn btn-outline"
              >
                Try Again
              </button>
              <Link to="/login" className="btn btn-primary">
                Back to Login
              </Link>
            </div>
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
            maxWidth: "400px",
            margin: "0 auto",
            background: "var(--card-bg)",
            padding: "3rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "var(--primary-blue)",
              marginBottom: "1rem",
            }}
          >
            Forgot Password?
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              color: "var(--text-gray)",
            }}
          >
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{ width: "100%" }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginBottom: "1rem" }}
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : "Send Reset Instructions"}
            </button>
          </form>

          <div style={{ textAlign: "center" }}>
            <Link to="/login" style={{ color: "var(--primary-green)" }}>
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
