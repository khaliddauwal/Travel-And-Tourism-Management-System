import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <h3>Travel & Tourism Management System</h3>
            <p>
              Professional travel and tourism management platform designed for
              efficient operations worldwide. Streamline bookings, manage visa
              applications, and oversee tour packages with comprehensive
              administrative tools.
            </p>
          </div>
          <div>
            <h3>Quick Access</h3>
            <ul style={{ listStyle: "none" }}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">System Login</Link>
              </li>
              <li>
                <Link to="/about">About System</Link>
              </li>
              <li>
                <Link to="/contact">Support</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>System Features</h3>
            <ul style={{ listStyle: "none" }}>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/packages">Package Management</Link>
              </li>
              <li>
                <Link to="/visa-request">Visa Assistance</Link>
              </li>
              <li>
                <Link to="/admin/users">User Management</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>System Information</h3>
            <ul style={{ listStyle: "none", fontSize: "0.875rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Roles:</strong> Tourist, Admin
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Coverage:</strong> Global
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Focus:</strong> Travel & Tourism Management
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Support:</strong> 24/7 System Access
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © 2026 Travel & Tourism Management System. All rights reserved. |
            Global Travel & Tourism Management Solution
          </p>
          <p
            style={{ marginTop: "0.5rem", fontSize: "0.875rem", opacity: 0.8 }}
          >
            Professional Travel & Tourism Management Solution for Global
            Operations
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
