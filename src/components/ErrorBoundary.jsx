import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            background: "#fef2f2",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2 style={{ color: "#dc2626", marginBottom: "12px" }}>
            ⚠️ Something went wrong
          </h2>
          <p style={{ color: "#991b1b", maxWidth: "600px", marginBottom: "20px" }}>
            {this.state.error && this.state.error.toString()}
          </p>
          <pre
            style={{
              textAlign: "left",
              background: "#ffffff",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "16px",
              maxWidth: "800px",
              overflow: "auto",
              fontSize: "12px",
              color: "#374151",
              maxHeight: "300px",
            }}
          >
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 24px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
