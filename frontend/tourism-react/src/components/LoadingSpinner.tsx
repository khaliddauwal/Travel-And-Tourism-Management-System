import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  text = "Loading...",
  fullScreen = false,
}) => {
  const sizeClasses = {
    small: "20px",
    medium: "40px",
    large: "60px",
  };

  const containerStyle = fullScreen
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-primary)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
      }
    : {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        padding: "2rem",
      };

  return (
    <div style={containerStyle} className="loading-spinner-container">
      <div
        className={`loading-spinner loading-spinner-${size}`}
        style={{
          width: sizeClasses[size],
          height: sizeClasses[size],
        }}
      ></div>
      {text && (
        <p
          className="loading-text"
          style={{
            fontSize: size === "small" ? "0.875rem" : "1rem",
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
