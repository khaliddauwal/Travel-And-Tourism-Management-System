import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters long", "error");
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        mobileNumber: formData.mobileNumber,
      });
      showToast("Registration successful! Welcome aboard.", "success");
      navigate("/tourist/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      showToast(
        err?.message || "Registration failed. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="register-form-wrapper">
          <h2
            style={{
              textAlign: "center",
              color: "var(--primary-blue)",
              marginBottom: "2rem",
            }}
          >
            Register
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile Number (e.g., +234-800-123-4567)"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="password"
                name="password"
                placeholder="Password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? <span className="loading"></span> : "Register"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--primary-green)" }}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
