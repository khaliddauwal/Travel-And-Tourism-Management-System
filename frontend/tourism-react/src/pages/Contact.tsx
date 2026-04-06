import React, { useState } from "react";
import { apiService } from "../services/api";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await apiService.sendContactMessage(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
          }}
        >
          <div>
            <h3 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>
              Get in Touch
            </h3>
            <div style={{ marginBottom: "1rem" }}>
              <strong>📍 Address:</strong>
              <br />
              123 Business Center, Suite 456
              <br />
              Global Business District
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <strong>📞 Phone:</strong>
              <br />
              +1-800-TRAVEL-MGMT
              <br />
              +1-555-123-4567
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <strong>✉️ Email:</strong>
              <br />
              info@travelmanagement.com
              <br />
              support@travelmanagement.com
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <strong>🕒 Business Hours:</strong>
              <br />
              Monday - Friday: 9:00 AM - 6:00 PM
              <br />
              Saturday: 10:00 AM - 4:00 PM
              <br />
              Sunday: Closed
            </div>
          </div>

          <div>
            <h3 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>
              Send Message
            </h3>

            {success && (
              <div className="alert alert-success">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <span className="loading"></span> : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
