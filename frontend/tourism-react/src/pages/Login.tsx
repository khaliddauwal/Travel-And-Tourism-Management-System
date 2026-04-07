import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const doLogin = async (loginEmail: string, loginPassword: string) => {
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      showToast("Login successful! Welcome back.", "success");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      showToast(err?.message || "Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin(email, password);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="login-container">
          <div className="login-form">
            <h2
              style={{
                textAlign: "center",
                color: "var(--primary-blue)",
                marginBottom: "2rem",
              }}
            >
              Login to Travel Manager
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <p>
                <Link
                  to="/forgot-password"
                  style={{ color: "var(--primary-green)" }}
                >
                  Forgot your password?
                </Link>
              </p>
              <p>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "var(--primary-green)" }}>
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
