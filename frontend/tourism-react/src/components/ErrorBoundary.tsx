import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    console.error("Error stack:", error.stack);
    console.error("Component stack:", errorInfo.componentStack);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="container">
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                margin: "2rem auto",
                maxWidth: "500px",
              }}
            >
              <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>
                🚨 Something went wrong
              </h2>
              <p style={{ marginBottom: "2rem", color: "#666" }}>
                We're sorry, but something unexpected happened. Please try
                refreshing the page.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
