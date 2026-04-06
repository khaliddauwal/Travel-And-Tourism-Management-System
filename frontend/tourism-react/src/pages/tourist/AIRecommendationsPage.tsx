import React from "react";
import AIRecommendations from "./components/AIRecommendations";

const AIRecommendationsPage: React.FC = () => {
  return (
    <div className="ai-recommendations-page">
      <div className="page-hero">
        <div className="container">
          <div className="hero-content">
            <h1>🤖 AI Travel Assistant</h1>
            <p className="hero-subtitle">
              Let our intelligent AI assistant help you discover the perfect
              travel packages tailored to your preferences, budget, and
              interests.
            </p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <AIRecommendations
            showPreferencesForm={true}
            maxRecommendations={6}
          />
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationsPage;
