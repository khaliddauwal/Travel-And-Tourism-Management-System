import React from "react";

const About: React.FC = () => {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">
          About Travel & Tourism Management System
        </h2>
        <div
          style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}
        >
          <p
            style={{
              fontSize: "1.2rem",
              lineHeight: "1.8",
              color: "var(--text-gray)",
              marginBottom: "2rem",
            }}
          >
            Travel & Tourism Management System is a comprehensive platform
            designed to streamline travel and tourism operations worldwide. We
            provide professional tools for managing bookings, destinations, visa
            applications, and tour packages with advanced administrative
            capabilities.
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              color: "var(--text-gray)",
            }}
          >
            From destination management to booking coordination, from visa
            processing to tour package administration, we help travel
            professionals manage their operations efficiently and effectively.
          </p>
        </div>

        {/* Mission & Vision */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            marginTop: "4rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
            <h3 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>
              Our Mission
            </h3>
            <p>
              To provide comprehensive travel and tourism management solutions
              that streamline operations, enhance customer experiences, and
              support the growth of travel businesses worldwide through
              innovative technology and professional tools.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👁️</div>
            <h3 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>
              Our Vision
            </h3>
            <p>
              To become the leading travel and tourism management platform
              globally, empowering travel professionals with cutting-edge tools
              and comprehensive solutions for efficient business operations and
              exceptional customer service.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💎</div>
            <h3 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>
              Our Values
            </h3>
            <p>
              Excellence in service delivery, innovative technology solutions,
              sustainable business practices, and unwavering commitment to
              supporting travel professionals worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
