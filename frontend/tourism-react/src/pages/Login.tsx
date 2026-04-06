import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import {
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_COLORS,
  ROLE_ICONS,
} from "../types/roles";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

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

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    doLogin(demoEmail, demoPassword);
  };

  const demoAccounts = [
    {
      role: "tourist" as const,
      email: "tourist@tms.com",
      password: "Tourist@123",
      name: "Demo Tourist",
    },
    {
      role: "admin" as const,
      email: "admin@tms.com",
      password: "Admin@123",
      name: "System Administrator",
    },
  ];

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

            {/* Demo Accounts Toggle */}
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="btn btn-outline"
                style={{ fontSize: "0.875rem" }}
              >
                {showDemoAccounts ? "Hide" : "Show"} Demo Accounts
              </button>
            </div>
          </div>

          {/* Demo Accounts Panel */}
          {showDemoAccounts && (
            <div className="demo-accounts">
              <h3>🎭 Demo Accounts</h3>
              <p>Try different user roles with these demo accounts:</p>

              <div className="demo-accounts-grid">
                {demoAccounts.map((account) => (
                  <div key={account.role} className="demo-account-card">
                    <div className="demo-account-header">
                      <div
                        className="role-badge"
                        style={{
                          backgroundColor: ROLE_COLORS[account.role],
                        }}
                      >
                        {ROLE_ICONS[account.role]} {ROLE_LABELS[account.role]}
                      </div>
                    </div>
                    <div className="demo-account-content">
                      <h4>{account.name}</h4>
                      <p className="demo-description">
                        {ROLE_DESCRIPTIONS[account.role]}
                      </p>
                      <div className="demo-credentials">
                        <small>
                          <strong>Email:</strong> {account.email}
                          <br />
                          <strong>Password:</strong> {account.password}
                        </small>
                      </div>
                      <button
                        onClick={() =>
                          handleDemoLogin(account.email, account.password)
                        }
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: "100%", marginTop: "1rem" }}
                      >
                        Login as {ROLE_LABELS[account.role]}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;
